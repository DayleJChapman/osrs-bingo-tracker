import { WOMClient } from "@wise-old-man/utils";

const username = Bun.env["DISCORD_USERNAME"];
if (!username) throw new Error(`Missing env "DISCORD_USERNAME"`);

export const womClient = new WOMClient({
  userAgent: username,
});
