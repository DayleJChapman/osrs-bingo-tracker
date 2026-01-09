import { db } from "@/lib/db";
import { players } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const playersRouter = new Hono();

playersRouter.get("", async (c) => {
  const queryRes = await db.select().from(players);
  return c.json(queryRes);
});

playersRouter.get("/:playerId", async (c) => {
  const { playerId } = c.req.param();
  if (Number.isNaN(playerId)) {
    throw new HTTPException(422, { message: `Invalid id ${playerId}` });
  }

  const queryRes = await db
    .select()
    .from(players)
    .where(eq(players.id, Number(playerId)));

  const team = queryRes[0];
  if (!team) {
    throw new HTTPException(404, {
      message: `No team found with id ${playerId}`,
    });
  }

  return c.json(team);
});

export { playersRouter };
