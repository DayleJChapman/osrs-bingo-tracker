import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { teams } from "./teams";

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
