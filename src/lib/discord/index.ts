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
