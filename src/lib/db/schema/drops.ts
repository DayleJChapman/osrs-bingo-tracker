import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const drops = sqliteTable("drops", {
  id: int().primaryKey(),
  teamId: int().notNull(),
  playerId: int().notNull(),
  source: text().notNull(),
  item: text().notNull(),
});
