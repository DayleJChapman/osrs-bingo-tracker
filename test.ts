import { db } from "@/lib/db";
import { players, teams } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";

const teamCaptains = ["blob870", "hi eddie", "in the beers", "3pic"];
await db
  .update(players)
  .set({ isTeamCaptain: true })
  .where(inArray(players.username, teamCaptains));
