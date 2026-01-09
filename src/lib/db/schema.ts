import { relations } from "drizzle-orm";
import { int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const players = sqliteTable("players", {
  id: int().primaryKey(),
  username: text().notNull().unique(),
  displayName: text().notNull().unique(),
  womId: int().notNull().unique(),
  teamId: int().notNull(),
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

export const tasks = sqliteTable("tasks", {
  id: int().primaryKey(),
  name: text().notNull(),
  tier: int().notNull(),
  pointValue: int().notNull(),
});

const taskStateValues = ["COMPLETE", "INCOMPLETE", "BLOCKED"] as const;
export const taskStates = sqliteTable("taskStates", {
  id: int().primaryKey(),
  taskId: int().notNull(),
  teamId: int().notNull(),
  state: text({ enum: taskStateValues }).default("INCOMPLETE"),
  completedAt: int({ mode: "timestamp" }),
});
