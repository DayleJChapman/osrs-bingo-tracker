import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { players } from "./players";

export const teams = sqliteTable("teams", {
  id: int().primaryKey(),
  name: text().notNull().unique(),
  points: int().notNull().default(0),
});

export const teamsRelations = relations(teams, ({ many }) => ({
  members: many(players),
}));
