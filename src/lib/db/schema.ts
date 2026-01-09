import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

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
});

export const teamsRelations = relations(teams, ({ many }) => ({
  members: many(players),
}));
