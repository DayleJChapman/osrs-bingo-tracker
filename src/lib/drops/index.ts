import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { drops, players } from "../db/schema";
import { getMessages, type DiscordMessage } from "../discord";
import mockData from "./mock-data.json";

let lastParsed = "";

const filterMessages = (message: DiscordMessage) => {
  return (
    message.author.username === "Rare Drop Notificator" &&
    message.embeds.length > 0
  );
};

type ScrapeResults = {
  item: string;
  source: string;
  recipientId: number;
  teamId: number;
  timestamp: string;
};

async function getDrops() {
  const allPlayers = await db.select().from(players);
  const messages = (await getMessages(lastParsed)).filter(filterMessages);

  const results: ScrapeResults[] = [];
  for (const message of messages) {
    const dropsData = parseMessageContent(message.embeds[0]?.description ?? "");
    if (!dropsData) continue;

    const recipient = message.embeds[0]?.author.username;
    if (!recipient) {
      throw new Error(`Could not find recipient in message object`);
    }

    const recipientPlayer = allPlayers.find((p) => p.username === recipient);
    if (!recipientPlayer) {
      throw new Error(`Could not find team for player "${recipient}"`);
    }

    results.push({
      ...dropsData,
      recipientId: recipientPlayer.id,
      teamId: recipientPlayer.teamId,
      timestamp: message.timestamp,
    });

    lastParsed = message.id;
  }

  return results;
}

function parseMessageContent(content: string) {
  const REGEXP =
    /^Just got \[(?<item>[\w\s]+)\].* from (?:lvl \d+ )?\[(?<source>[\w\s]+)\].*$/;

  const result = REGEXP.exec(content);
  if (!result) return null;

  const item = result[1] ?? "";
  const source = result[2] ?? "";

  return {
    item: item.toLowerCase(),
    source,
  };
}

export async function getDropsForTeam(teamId: number, item: string) {
  return db.$count(drops, and(eq(drops.teamId, teamId), eq(drops.item, item)));
}

export async function scrapeDiscord() {
  console.log("Getting drops");
  const newDrops = await getDrops();

  for (const drop of newDrops) {
    await db.insert(drops).values({
      item: drop.item,
      teamId: drop.teamId,
      playerId: drop.recipientId,
      source: drop.source,
    });
  }

  console.log("Finished getting drops");
}

export async function seedDrops() {
  await db.delete(drops);
  for (const drop of mockData) {
    await db.insert(drops).values(drop);
  }
}
