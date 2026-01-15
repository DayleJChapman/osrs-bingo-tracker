import { relations } from "drizzle-orm";
import { int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { teams } from "./teams";

export const tasks = sqliteTable("tasks", {
  id: int().primaryKey(),
  name: text().notNull(),
  label: text().default(""),
  description: text().default(""),
});

export const tasksRelations = relations(tasks, ({ many }) => ({
  tiers: many(tiers),
  metadata: many(taskMetadata),
  tierCompletionStates: many(tierCompletionStates),
}));

export const taskMetadata = sqliteTable("taskMetadata", {
  id: int().primaryKey(),
  taskId: int().notNull(),
  teamId: int().notNull(),
  metadata: text({ mode: "json" }).notNull().$type<Record<string, unknown>>(),
});
export type TaskMetadataRecord = typeof taskMetadata.$inferSelect;

export const taskMetadataRelations = relations(taskMetadata, ({ one }) => ({
  task: one(tasks, {
    fields: [taskMetadata.taskId],
    references: [tasks.id],
  }),
  team: one(teams, {
    fields: [taskMetadata.teamId],
    references: [teams.id],
  }),
}));

export const tiers = sqliteTable("tiers", {
  id: int().primaryKey(),
  taskId: int().notNull(),
  number: int().notNull(),
  description: text().default(""),
  points: int().notNull(),
  requirements: text({ mode: "json" }).$type<string[]>().default([]),
});

export const tiersRelations = relations(tiers, ({ one }) => ({
  task: one(tasks, {
    fields: [tiers.taskId],
    references: [tasks.id],
  }),
}));

const taskStateValues = ["COMPLETE", "INCOMPLETE", "BLOCKED"] as const;
export type TaskStates = (typeof taskStateValues)[number];
export const tierCompletionStates = sqliteTable(
  "tierCompletionStates",
  {
    id: int().primaryKey(),
    taskId: int().notNull(),
    tierId: int().notNull(),
    teamId: int().notNull(),
    state: text({ enum: taskStateValues }).default("INCOMPLETE"),
  },
  (t) => [unique().on(t.tierId, t.teamId)],
);

export const tierCompletionStatesRelations = relations(
  tierCompletionStates,
  ({ one }) => ({
    tier: one(tiers, {
      fields: [tierCompletionStates.tierId],
      references: [tiers.id],
    }),
    task: one(tasks, {
      fields: [tierCompletionStates.taskId],
      references: [tasks.id],
    }),
    team: one(teams, {
      fields: [tierCompletionStates.teamId],
      references: [teams.id],
    }),
  }),
);
