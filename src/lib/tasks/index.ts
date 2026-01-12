import { and, eq } from "drizzle-orm";
import { db } from "../db";
import {
  bossKc,
  drops,
  taskMetadata,
  tasks,
  teams,
  xpGains,
  type TaskStates,
} from "../db/schema";
import { taskList } from "./task";
import { scrapeDiscord, seedDrops } from "../drops";

async function checkTeamTasks(teamId: number) {
  let totalPoints = 0;
  const [drops, skills, bosses] = await Promise.all([
    getDrops(teamId),
    getSkills(teamId),
    getBossKc(teamId),
  ]);

  for (const [, task] of Object.entries(taskList)) {
    const filteredDrops = drops.filter((v) => task.drops.includes(v.item));
    const filteredSkills = skills.filter((v) => task.skills.includes(v.skill));
    const filteredBosses = bosses.filter((v) => task.bosses.includes(v.boss));
    const taskMetadata = await getTaskMetadata(teamId, task.name);

    let prevTierState: TaskStates = "COMPLETE";
    for (const [tierKey, tier] of Object.entries(task.tiers)) {
      let state: TaskStates = "INCOMPLETE";
      const isComplete = await tier.isComplete({
        drops: filteredDrops,
        skills: filteredSkills,
        bosses: filteredBosses,
        metadata: taskMetadata[0]?.metadata ?? {},
      });

      if (isComplete) {
        if (prevTierState === "COMPLETE") {
          state = "COMPLETE";
          totalPoints += tier.points;
        } else {
          state = "BLOCKED";
        }
      }

      console.log(`Task: ${task.name} - Tier ${tierKey}: ${state}`);
      prevTierState = state;
    }
  }

  console.log(`Total Points: ${totalPoints}`);
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
  const taskQuery = await db
    .select({ id: tasks.id })
    .from(tasks)
    .where(eq(tasks.name, taskName));
  const id = taskQuery[0]!.id;
  return db
    .select()
    .from(taskMetadata)
    .where(and(eq(taskMetadata.taskId, id), eq(taskMetadata.teamId, teamId)));
}

const teamsQuery = await db.select().from(teams);
await seedDrops();
for (const team of teamsQuery) {
  console.log(`Team ${team.name}`);
  await checkTeamTasks(team.id);
}
