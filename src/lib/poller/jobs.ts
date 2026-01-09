import type { CronCallback, CronOptions } from "croner";
import { db } from "../db";
import { players, xpGains } from "../db/schema";
import { womClient } from "../wom";
import { Period } from "@wise-old-man/utils";

interface PollerJob {
  pattern: string | Date;
  fn: CronCallback;
  opts: Omit<CronOptions, "name"> & { name: string };
}

export const jobs: PollerJob[] = [
  {
    pattern: "* * * * *",
    opts: {
      name: "get_xp_gains",
    },
    fn: async () => {
      console.log("Starting job get_xp_gains");
      const playerUsernames = await db
        .select({
          username: players.username,
          playerId: players.id,
          teamId: players.teamId,
        })
        .from(players);

      await Promise.all(
        playerUsernames.map(async ({ username, playerId, teamId }) => {
          const gains = await womClient.players.getPlayerGains(username, {
            period: Period.WEEK,
          });
          const { hunter, slayer, smithing, cooking } = gains.data.skills;
          await Promise.all([
            db
              .insert(xpGains)
              .values({
                playerId,
                teamId,
                skill: "hunter",
                amount: hunter.experience.gained,
              })
              .onConflictDoUpdate({
                target: [xpGains.playerId, xpGains.skill],
                set: { amount: hunter.experience.gained },
              }),
            db
              .insert(xpGains)
              .values({
                playerId,
                teamId,
                skill: "smithing",
                amount: smithing.experience.gained,
              })
              .onConflictDoUpdate({
                target: [xpGains.playerId, xpGains.skill],
                set: { amount: smithing.experience.gained },
              }),
            db
              .insert(xpGains)
              .values({
                playerId,
                teamId,
                skill: "slayer",
                amount: slayer.experience.gained,
              })
              .onConflictDoUpdate({
                target: [xpGains.playerId, xpGains.skill],
                set: { amount: slayer.experience.gained },
              }),
            db
              .insert(xpGains)
              .values({
                playerId,
                teamId,
                skill: "cooking",
                amount: cooking.experience.gained,
              })
              .onConflictDoUpdate({
                target: [xpGains.playerId, xpGains.skill],
                set: { amount: cooking.experience.gained },
              }),
          ]);
        }),
      );

      console.log("Finished job get_xp_gains");
    },
  },
] as const;
