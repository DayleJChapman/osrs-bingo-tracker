import { relations } from "drizzle-orm";
import { int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const players = sqliteTable("players", {
  id: int().primaryKey(),
  username: text().notNull().unique(),
  displayName: text().notNull().unique(),
  womId: int().notNull().unique(),
  teamId: int().notNull(),
  isTeamCaptain: int({ mode: "boolean" }).default(false),
});

export const playersRelations = relations(players, ({ one }) => ({
  teamId: one(teams, {
    fields: [players.teamId],
    references: [teams.id],
  }),
}));

export const teams = sqliteTable("teams", {
  id: int().primaryKey(),
  name: text().notNull().unique(),
  points: int().notNull().default(0),
});

export const teamsRelations = relations(teams, ({ many }) => ({
  members: many(players),
}));

const trackedSkills = ["hunter", "smithing", "slayer", "cooking"] as const;
export const xpGains = sqliteTable(
  "xpGains",
  {
    id: int().primaryKey(),
    playerId: int().notNull(),
    teamId: int().notNull(),
    skill: text({ enum: trackedSkills }).notNull(),
    amount: int().notNull(),
  },
  (t) => [unique().on(t.playerId, t.skill)],
);

export const tasks = sqliteTable(
  "tasks",
  {
    id: int().primaryKey(),
    name: text().notNull(),
    tier: int().notNull(),
    pointValue: int().notNull(),
  },
  (t) => [unique().on(t.name, t.tier)],
);

const taskStateValues = ["COMPLETE", "INCOMPLETE", "BLOCKED"] as const;
export type TaskStates = (typeof taskStateValues)[number];
export const taskStates = sqliteTable(
  "taskStates",
  {
    id: int().primaryKey(),
    taskId: int().notNull(),
    teamId: int().notNull(),
    state: text({ enum: taskStateValues }).default("INCOMPLETE"),
    completedAt: int({ mode: "timestamp" }),
  },
  (t) => [unique().on(t.taskId, t.teamId)],
);

export const taskMetadata = sqliteTable("taskMetadata", {
  id: int().primaryKey(),
  taskId: int().notNull(),
  teamId: int().notNull(),
  metadata: text({ mode: "json" }).notNull(),
});

export const drops = sqliteTable("drops", {
  id: int().primaryKey(),
  teamId: int().notNull(),
  playerId: int().notNull(),
  source: text().notNull(),
  item: text().notNull(),
});

export const bossKc = sqliteTable(
  "bossKc",
  {
    id: int().primaryKey(),
    playerId: int().notNull(),
    teamId: int().notNull(),
    boss: text().notNull(),
    amount: int().notNull().default(0),
  },
  (t) => [unique().on(t.playerId, t.boss)],
);
