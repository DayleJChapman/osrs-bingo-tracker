import type { MessageEmbeds } from "./messages";
import mockData from "./mock-data.json";

export type DiscordMessageUser = {
  id: string;
  username: string;
};
export type DiscordMessageEmbeds = {
  title?: string;
  description?: string;
  author: DiscordMessageUser;
};
export type DiscordMessage = {
  id: string;
  embeds: DiscordMessageEmbeds[];
  author: DiscordMessageUser;
  timestamp: string;
};

export async function getMessages(afterId?: string) {
  if (Bun.env["NODE_ENV"] === "production") {
    return getLiveData(afterId);
  } else {
    return getMockData();
  }
}

export async function getLiveData(afterId?: string) {
  const BASE_URL = "https://discord.com/api/v10";
  const token = Bun.env["DISCORD_TOKEN"];
  const channelId = Bun.env["DISCORD_CHANNEL"];

  if (!token) throw new Error("Missing DISCORD_TOKEN");
  if (!channelId) throw new Error("Missing DISCORD_CHANNEL");

  const query = afterId ? `?after=${afterId}` : "";
  const url = `${BASE_URL}/channels/${channelId}/messages${query}`;

  const response = await fetch(url, {
    headers: {
      Authorization: token,
    },
  });
  const body = await response.json();

  return body as DiscordMessage[];
}

export function getMockData(afterId?: string) {
  if (afterId) {
    return [];
  }
  return mockData;
}

export async function sendWebhookMessage(content: MessageEmbeds) {
  const BASE_URL = Bun.env["DISCORD_WEBHOOK"];
  if (!BASE_URL) throw new Error("Missing DISCORD_WEBHOOK");

  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "User-Agent": `DiscordBot (https://github.com/DayleJChapman/osrs-bingo-tracker, v0.0.1)`,
      },
      body: JSON.stringify({
        tts: false,
        embeds: [{ ...content }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    console.log("Message sent");
  } catch (error) {
    console.error(error);
  }
}
