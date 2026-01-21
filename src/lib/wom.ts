import {
  Period,
  WOMClient,
  type PlayerDeltasMapResponse,
} from "@wise-old-man/utils";
import { db } from "./db";
import { bossKc, players, xpGains } from "./db/schema";

const username = Bun.env["DISCORD_USERNAME"];
if (!username) throw new Error(`Missing env "DISCORD_USERNAME"`);

export const womClient = new WOMClient({
  userAgent: username,
});

// Delay between API requests to avoid rate limiting (in ms)
const API_REQUEST_DELAY = 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function scrapeWOM() {
  console.log("Updating data from WOM");
  const queryResult = await db.select().from(players);

  // Process players sequentially with delay to avoid rate limiting
  for (let i = 0; i < queryResult.length; i++) {
    const player = queryResult[i];
    console.log(`Fetching WOM data for ${player.username} (${i + 1}/${queryResult.length})`);

    try {
      await handleUpdatePlayer(player);
    } catch (error) {
      console.error(`Failed to update player ${player.username}:`, error);
    }

    // Add delay between requests (skip delay after last player)
    if (i < queryResult.length - 1) {
      await sleep(API_REQUEST_DELAY);
    }
  }

  console.log("Done updating data from WOM");
}

async function getGains(username: string) {
  return womClient.players.getPlayerGains(username, { period: Period.WEEK });
}

async function handleUpdatePlayer(player: {
  username: string;
  teamId: number;
  id: number;
}) {
  const gains = await getGains(player.username);

  await Promise.all([
    updateXpGains(player, gains.data.skills),
    updateBossKc(player, gains.data.bosses),
  ]);
}

async function updateXpGains(
  player: { username: string; teamId: number; id: number },
  skills: PlayerDeltasMapResponse["skills"],
) {
  const trackedSkills = [
    skills.hunter,
    skills.slayer,
    skills.smithing,
    skills.cooking,
  ];

  await Promise.all(
    trackedSkills.map(async (skill) =>
      db
        .insert(xpGains)
        .values({
          playerId: player.id,
          teamId: player.teamId,
          skill: skill.metric as "hunter" | "slayer" | "smithing" | "cooking",
          amount: skill.experience.gained,
        })
        .onConflictDoUpdate({
          target: [xpGains.playerId, xpGains.skill],
          set: { amount: skill.experience.gained },
        }),
    ),
  );
}

async function updateBossKc(
  player: { username: string; teamId: number; id: number },
  bosses: PlayerDeltasMapResponse["bosses"],
) {
  const trackedBosses = [
    bosses.chambers_of_xeric,
    bosses.chambers_of_xeric_challenge_mode,
    bosses.tombs_of_amascut,
    bosses.tombs_of_amascut_expert,
    bosses.theatre_of_blood,
    bosses.theatre_of_blood_hard_mode,
    bosses.the_corrupted_gauntlet,
  ];

  await Promise.all(
    trackedBosses.map(async (boss) =>
      db
        .insert(bossKc)
        .values({
          playerId: player.id,
          teamId: player.teamId,
          boss: boss.metric,
          amount: boss.kills.gained,
        })
        .onConflictDoUpdate({
          target: [bossKc.playerId, bossKc.boss],
          set: { amount: boss.kills.gained },
        }),
    ),
  );
}
