import type { TaskDetail, TierDetail } from "@/types";
import { db } from ".";
import { taskList } from "../tasks/task";
import { womClient } from "../wom";
import {
  drops,
  players,
  tasks,
  teams,
  tierCompletionStates,
  tiers,
} from "./schema";
import type {
  CompetitionDetailsResponse,
  PlayerResponse,
} from "@wise-old-man/utils";
import mockDrops from "@/lib/drops/mock-data.json";

type Opts = {
  useMock: boolean;
  deleteOld: boolean;
};

const defaultOpts: Opts = {
  useMock: false,
  deleteOld: true,
};

if (import.meta.path === Bun.main) {
  const opts = parseArgs();

  if (opts.deleteOld) {
    await Promise.all([
      db.delete(players),
      db.delete(teams),
      db.delete(drops),
      db.delete(tasks),
      db.delete(tiers),
      db.delete(tierCompletionStates),
    ]);
  }

  await seed(opts.useMock);
}

function parseArgs(): Opts {
  const opts = defaultOpts;
  const argRegExp =
    /^-(?<flag_short>[a-z])|--(?<flag_full>[a-zA-Z]+)(?:=(?<flag_val>\w+))?$/;

  if (Bun.argv.includes("-h") || Bun.argv.includes("--help")) {
    help();
  }

  for (let i = 2; i < Bun.argv.length; i++) {
    const arg = Bun.argv[i]!;
    const matchResults = argRegExp.exec(arg);

    if (matchResults?.groups) {
      const { flag_short, flag_full, flag_val } = matchResults.groups;
      const flag = flag_short ?? flag_full;

      switch (flag) {
        case "m":
        case "useMock": {
          opts.useMock = flag_val ? flag_val === "true" : true;
          break;
        }
        case "d":
        case "delete": {
          opts.deleteOld = flag_val ? flag_val === "true" : true;
          break;
        }
        default: {
          console.log("Ignoring unknown flag", flag);
        }
      }
    }
  }

  return opts;
}

function help(): never {
  console.log(`
OSRS Bingo Scoreboard - Seed DB

Usage: bun run db:seed [options]

Available Options:
  -h, --help                          Print this content and exit.
  -m, --useMock[=<boolean>]           Populates the DB with mock data. Default: false
  -d, --delete[=<boolean>]            Delete old data before seeding. Default: true
`);

  process.exit(0);
}

export async function seed(withMock: boolean = false) {
  console.log("Starting seeding process");

  const compId = Bun.env["WOM_COMP_ID"];
  if (!compId || Number.isNaN(compId))
    throw new Error("Invalid or missing WOM_COMP_ID");

  const competition = await womClient.competitions.getCompetitionDetails(
    Number(compId),
  );

  await Promise.all([
    seedTeams(competition),
    seedTasks(),
    withMock ? seedMockData() : undefined,
  ]);

  await seedTierStates();
}

export async function seedMockData() {
  console.log("Seeding mock data");
  return Promise.all([seedDrops()]);
}

async function seedTeams(competition: CompetitionDetailsResponse) {
  const teamsMap = new Map<string, PlayerResponse[]>();

  for (const participant of competition.participations) {
    const teamName = participant.teamName;
    if (!teamName) {
      throw new Error(
        `Participant ${participant.player.displayName} lacking team name`,
      );
    }

    if (teamsMap.has(teamName)) {
      const prev = teamsMap.get(teamName)!;
      teamsMap.set(teamName, [...prev, participant.player]);
    } else {
      teamsMap.set(teamName, [participant.player]);
    }
  }

  const newTeams = await Promise.all(
    teamsMap
      .entries()
      .map(async ([name, players]) => await seedTeam(name, players)),
  );

  console.log(`Inserted ${newTeams.length} records into table "teams"`);
  return newTeams;
}

async function seedTeam(name: string, players: PlayerResponse[]) {
  const res = await db.insert(teams).values({ name }).returning();
  const newTeam = res[0];
  if (!newTeam) throw new Error("Team inserted but not returned");

  const newPlayers = await Promise.all(
    players.map(async (player) => await seedPlayer(player, newTeam.id)),
  );

  console.log(
    `Inserted ${newPlayers.length} records into table "players" for team ${newTeam.name}`,
  );
  return res[0];
}

async function seedPlayer(player: PlayerResponse, teamId: number) {
  const teamCaptains = ["blob870", "hi eddie", "in the beers", "3pic"];

  const res = await db
    .insert(players)
    .values({
      teamId,
      displayName: player.displayName,
      username: player.username,
      womId: player.id,
      isTeamCaptain: teamCaptains.includes(player.username),
    })
    .onConflictDoUpdate({
      target: players.womId,
      set: {
        displayName: player.displayName,
        username: player.username,
        isTeamCaptain: teamCaptains.includes(player.username),
      },
    })
    .returning();

  if (!res[0]) throw new Error("Player inserted but not returned");
}

async function seedTasks() {
  const newTasks = await Promise.all(
    Object.values(taskList).map(async (task) => await seedTask(task)),
  );
  console.log(`Inserted ${newTasks.length} tasks`);
  return newTasks;
}

async function seedTask(newTask: TaskDetail) {
  const newTaskResult = await db
    .insert(tasks)
    .values({
      name: newTask.name,
      label: newTask.label,
      description: newTask.description,
    })
    .onConflictDoUpdate({
      target: tasks.name,
      set: { label: newTask.label, description: newTask.description },
    })
    .returning();

  const insertedTask = newTaskResult[0];
  if (!insertedTask) {
    throw new Error(`Task ${newTask.name} was inserted but not returned`);
  }

  const newTiers = await Promise.all(
    Object.entries(newTask.tiers).map(
      async ([i, tier]) => await seedTier(tier, Number(i), insertedTask.id),
    ),
  );

  console.log(`Inserted ${newTiers.length} tiers for task ${newTask.name}`);
  return insertedTask;
}

async function seedTier(
  newTier: TierDetail,
  tierNumber: number,
  taskId: number,
) {
  const res = await db
    .insert(tiers)
    .values({
      number: tierNumber,
      taskId,
      points: newTier.points,
      description: newTier.description,
      requirements: newTier.requirements,
    })
    .onConflictDoUpdate({
      target: [tiers.number, tiers.taskId],
      set: {
        points: newTier.points,
        description: newTier.description,
        requirements: newTier.requirements,
      },
    })
    .returning();

  if (!res[0]) throw new Error(`Tier inserted but not returned`);
  return res[0];
}

async function seedDrops() {
  const res = await db.insert(drops).values(mockDrops).returning();
  console.log(`Inserted ${res.length} records into table "drops"`);
  return res;
}

async function seedTierStates() {
  const [teamIds, tierIds] = await Promise.all([
    db.select({ id: teams.id }).from(teams),
    db.select({ taskId: tiers.taskId, id: tiers.id }).from(tiers),
  ]);

  const values: (typeof tierCompletionStates.$inferInsert)[] = [];
  for (const { id: teamId } of teamIds) {
    for (const { id: tierId, taskId } of tierIds) {
      values.push({
        teamId,
        taskId,
        tierId,
        state: "INCOMPLETE",
      });
    }
  }

  try {
    await db.insert(tierCompletionStates).values(values);
    console.log(
      `Inserted ${values.length} records into table "tierCompletionStates"`,
    );
  } catch (error) {
    console.error(error);
    console.log("Team IDs:", teamIds);
    console.log("Tier IDs:", tierIds);
  }
}
