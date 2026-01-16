import { int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

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
