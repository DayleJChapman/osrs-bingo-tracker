import { int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

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
