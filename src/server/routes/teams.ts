import { db } from "@/lib/db";
import { teams } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const teamsRouter = new Hono();

teamsRouter.get("/", async (c) => {
  const queryRes = await db.select().from(teams);
  return c.json(queryRes);
});

teamsRouter.get("/:teamId", async (c) => {
  const { teamId } = c.req.param();
  if (Number.isNaN(teamId)) {
    throw new HTTPException(422, { message: `Invalid id ${teamId}` });
  }

  const queryRes = await db
    .select()
    .from(teams)
    .where(eq(teams.id, Number(teamId)));

  const team = queryRes[0];
  if (!team) {
    throw new HTTPException(404, {
      message: `No team found with id ${teamId}`,
    });
  }

  return c.json(team);
});

teamsRouter.get("/:teamId/members", async (c) => {
  const { teamId } = c.req.param();
  if (Number.isNaN(teamId)) {
    throw new HTTPException(422, { message: `Invalid id ${teamId}` });
  }

  const team = await db.query.teams.findFirst({
    where: eq(teams.id, Number(teamId)),
    with: { members: true },
  });

  if (!team) {
    throw new HTTPException(404, {
      message: `No team found with id ${teamId}`,
    });
  }

  console.log(team);
  return c.json(team);
});

export { teamsRouter };
