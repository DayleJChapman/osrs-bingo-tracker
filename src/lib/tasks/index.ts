import { and, eq, inArray, ne, sum } from "drizzle-orm";
import { db } from "../db";
import {
  bossKc,
  drops,
  taskMetadata,
  tasks,
  taskStates,
  teams,
  xpGains,
  type TaskStates,
} from "../db/schema";
import { taskList } from "./task";
import { incr } from "../utils";

async function checkTeamTasks(teamId: number) {
  console.log(`Checking status for team id ${teamId}`);
  let totalPoints = 0;
  const [drops, skills, bosses] = await Promise.all([
    getDrops(teamId),
    getSkills(teamId),
    getBossKc(teamId),
  ]);

  for (const [, task] of Object.entries(taskList)) {
    // type casting to 'never' is dumb but it shuts up TSC
    const filteredDrops = drops.filter((v) =>
      task.drops.includes(v.item as never),
    );
    const filteredSkills = skills.filter((v) =>
      task.skills.includes(v.skill as never),
    );
    const filteredBosses = bosses.filter((v) =>
      task.bosses.includes(v.boss as never),
    );

    const taskMetadata = await getTaskMetadata(teamId, task.name);

    let prevTierState: TaskStates = "COMPLETE";
    for (const [tier, tierData] of Object.entries(task.tiers)) {
      const taskData = await getTaskByName(task.name, Number(tier));
      if (!taskData) throw new Error("Could not find task data");

      const currentState = await getTaskState(teamId, taskData.id);
      if (currentState === "COMPLETE") continue;

      const isComplete = await tierData.isComplete({
        drops: filteredDrops,
        skills: filteredSkills,
        bosses: filteredBosses,
        metadata: taskMetadata?.metadata,
      });

      let state: TaskStates = "INCOMPLETE";
      if (isComplete) {
        if (prevTierState === "COMPLETE") {
          state = "COMPLETE";
          await addTaskPoints(teamId, tierData.points);
          totalPoints += tierData.points;
        } else {
          state = "BLOCKED";
        }
      }

      await updateTaskState({
        taskId: taskData.id,
        teamId,
        state,
      });

      prevTierState = state;
    }
  }

  console.log(`Done checking task status for team ${teamId}`);
}

async function updateTaskState({
  teamId,
  taskId,
  state,
}: {
  teamId: number;
  taskId: number;
  state: TaskStates;
}) {
  await db
    .update(taskStates)
    .set({ state })
    .where(and(eq(taskStates.teamId, teamId), eq(taskStates.taskId, taskId)));
}

async function addTaskPoints(teamId: number, points: number) {
  if (points <= 0) throw new Error(`Points must be a positive int`);

  await db
    .update(teams)
    .set({ points: incr(teams.points, points) })
    .where(eq(teams.id, teamId));
}

async function getTaskState(teamId: number, taskId: number) {
  const res = await db
    .select({ state: taskStates.state })
    .from(taskStates)
    .where(and(eq(taskStates.teamId, teamId), eq(taskStates.taskId, taskId)));

  return res[0]?.state ?? null;
}

async function getDrops(teamId: number) {
  return db.select().from(drops).where(eq(drops.teamId, teamId));
}

async function getSkills(teamId: number) {
  return db.select().from(xpGains).where(eq(xpGains.teamId, teamId));
}

async function getBossKc(teamId: number) {
  return db.select().from(bossKc).where(eq(bossKc.teamId, teamId));
}

async function getTaskMetadata(teamId: number, taskName: string) {
  const task = await getTaskByName(taskName, 1);
  if (!task) return null;

  const res = await db
    .select()
    .from(taskMetadata)
    .where(
      and(eq(taskMetadata.taskId, task.id), eq(taskMetadata.teamId, teamId)),
    );

  return res[0] ?? null;
}

async function getTaskByName(name: string, tier: number) {
  const res = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.name, name), eq(tasks.tier, tier)));

  return res[0] ?? null;
}

export async function updateAllTeamsTasks() {
  console.log(`Checking task status of all teams`);
  const teamsQuery = await db.select({ id: teams.id }).from(teams);

  await Promise.all(
    teamsQuery.map(async (team) => {
      await checkTeamTasks(team.id);
    }),
  );
}

async function getCompletedTaskPoints(teamId: number) {
  const completedTaskIds = await db
    .select({ taskId: taskStates.taskId })
    .from(taskStates)
    .where(
      and(eq(taskStates.teamId, teamId), eq(taskStates.state, "COMPLETE")),
    );

  const result = await db
    .select({ totalPoints: sum(tasks.pointValue) })
    .from(tasks)
    .where(
      inArray(
        tasks.id,
        completedTaskIds.map(({ taskId }) => taskId),
      ),
    );

  return Number(result[0]?.totalPoints ?? 0);
}

async function verifyTeamPoints(teamId: number) {
  const totalPoints = await getCompletedTaskPoints(teamId);

  const updated = await db
    .update(teams)
    .set({ points: totalPoints })
    .where(and(eq(teams.id, teamId), ne(teams.points, totalPoints)))
    .returning();

  if (updated.length > 0) {
    const updatedTeam = updated[0]!;
    console.log(`Points for team ${updatedTeam.name} were out of sync`);
  }
}

export async function verifyPoints() {
  console.log(`Verifying points are correct`);
  const teamsQuery = await db.select({ id: teams.id }).from(teams);

  await Promise.all(
    teamsQuery.map(async (team) => {
      await verifyTeamPoints(team.id);
    }),
  );
}
