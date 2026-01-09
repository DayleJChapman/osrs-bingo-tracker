import { db } from "@/lib/db";
import { xpGains } from "@/lib/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { Hono } from "hono";

const gainsRouter = new Hono();

gainsRouter.get("", async (c) => {
  const { team, player, skill } = c.req.query();

  const queryRes = await db
    .select()
    .from(xpGains)
    .where(
      and(
        team ? eq(xpGains.teamId, Number(team)) : undefined,
        player ? eq(xpGains.playerId, Number(player)) : undefined,
        skill ? eq(xpGains.skill, skill as "hunter") : undefined,
      ),
    )
    .orderBy(desc(xpGains.amount));

  return c.json(queryRes);
});

export { gainsRouter };
