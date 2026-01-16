import { and, eq, inArray, ne, sum } from "drizzle-orm";
import { db } from "../db";
import {
  bossKc,
  drops,
  taskMetadata,
  tasks,
  teams,
  tierCompletionStates,
  tiers,
  xpGains,
} from "../db/schema";
import { taskList } from "./task";
import { incr } from "../utils";
import type { TaskStates } from "../db/schema/tasks";

export async function checkTeamTasks(teamId: number) {
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
    for (const [i, tierData] of Object.entries(task.tiers)) {
      const taskData = await getTaskByName(task.name);
      if (!taskData) throw new Error("Could not find task data");

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

      const tierId = await getTierId(taskData.id, Number(i));
      if (!tierId) throw new Error("Could not find tier id");
      await updateTaskState({
        taskId: taskData.id,
        tierId,
        teamId,
        state,
      });

      prevTierState = state;
    }
  }

  console.log(`Done checking task status for team ${teamId}`);
}

async function getTierId(taskId: number, tier: number) {
  const res = await db
    .select({ id: tiers.id })
    .from(tiers)
    .where(and(eq(tiers.taskId, taskId), eq(tiers.number, tier)));
  return res[0]?.id ?? null;
}

async function updateTaskState({
  teamId,
  taskId,
  tierId,
  state,
}: {
  teamId: number;
  taskId: number;
  tierId: number;
  state: TaskStates;
}) {
  await db
    .update(tierCompletionStates)
    .set({ state })
    .where(
      and(
        eq(tierCompletionStates.teamId, teamId),
        eq(tierCompletionStates.tierId, tierId),
        eq(tierCompletionStates.taskId, taskId),
      ),
    );
}

async function addTaskPoints(teamId: number, points: number) {
  if (points <= 0) throw new Error(`Points must be a positive int`);

  await db
    .update(teams)
    .set({ points: incr(teams.points, points) })
    .where(eq(teams.id, teamId));
}

async function getTierState(teamId: number, taskId: number, tier: number) {
  const tierData = await db
    .select({ tierId: tiers.id })
    .from(tiers)
    .where(and(eq(tiers.taskId, taskId), eq(tiers.number, tier)));

  const tierId = tierData[0]?.tierId;
  if (!tierId) throw new Error("Could not find tier id");

  const res = await db
    .select()
    .from(tierCompletionStates)
    .where(
      and(
        eq(tierCompletionStates.teamId, teamId),
        eq(tierCompletionStates.taskId, taskId),
        eq(tierCompletionStates.tierId, tierId),
      ),
    );

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
  const task = await getTaskByName(taskName);
  if (!task) return null;

  const res = await db
    .select()
    .from(taskMetadata)
    .where(
      and(eq(taskMetadata.taskId, task.id), eq(taskMetadata.teamId, teamId)),
    );

  return res[0] ?? null;
}

async function getTaskByName(name: string) {
  const res = await db.select().from(tasks).where(eq(tasks.name, name));
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
  const completedTierIds = await db
    .select({ tierId: tierCompletionStates.tierId })
    .from(tierCompletionStates)
    .where(
      and(
        eq(tierCompletionStates.teamId, teamId),
        eq(tierCompletionStates.state, "COMPLETE"),
      ),
    );

  const result = await db
    .select({ totalPoints: sum(tiers.points) })
    .from(tiers)
    .where(
      inArray(
        tiers.id,
        completedTierIds.map(({ tierId }) => tierId),
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
