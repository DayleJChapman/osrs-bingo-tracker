import { db } from "@/lib/db";
import { drops, teams, tierCompletionStates, taskMetadata, tasks, tiers } from "@/lib/db/schema";
import type { TaskStates } from "@/lib/db/schema/tasks";
import { and, eq } from "drizzle-orm";
import { verifyTeamKey } from "@/server/auth";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { messageBuilder } from "@/lib/discord/messages";
import { sendWebhookMessage } from "@/lib/discord";
import { taskList } from "@/lib/tasks/task";

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

teamsRouter.get("/:teamId/drops", async (c) => {
  const { teamId } = c.req.param();
  if (Number.isNaN(teamId)) {
    throw new HTTPException(422, { message: `Invalid id ${teamId}` });
  }
  const queryRes = await db
    .select()
    .from(drops)
    .where(eq(drops.teamId, Number(teamId)));
  console.log(queryRes);
  return c.json(queryRes);
});

teamsRouter.get("/:teamId/tasks", async (c) => {
  const { teamId } = c.req.param();
  if (Number.isNaN(teamId)) {
    throw new HTTPException(422, { message: `Invalid id ${teamId}` });
  }

  const { state } = c.req.query();
  if (state && !["COMPLETE", "INCOMPLETE", "BLOCKED"].includes(state)) {
    throw new HTTPException(422, { message: `Invalid id ${teamId}` });
  }

  const queryRes = await db.query.tierCompletionStates.findMany({
    where: and(
      eq(tierCompletionStates.teamId, Number(teamId)),
      state ? eq(tierCompletionStates.state, state as TaskStates) : undefined,
    ),
    with: {
      team: true,
      task: true,
      tier: true,
    },
  });

  console.log(queryRes);
  return c.json(queryRes);
});

// Update tier completion state for a team
teamsRouter.put("/:teamId/tiers/:tierId", async (c) => {
  const { teamId, tierId } = c.req.param();
  if (Number.isNaN(Number(teamId))) {
    throw new HTTPException(422, { message: `Invalid teamId ${teamId}` });
  }
  if (Number.isNaN(Number(tierId))) {
    throw new HTTPException(422, { message: `Invalid tierId ${tierId}` });
  }

  // Verify authentication
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new HTTPException(401, { message: "Missing or invalid authorization header" });
  }
  const key = authHeader.slice(7);
  if (!verifyTeamKey(Number(teamId), key)) {
    throw new HTTPException(403, { message: "Invalid team key" });
  }

  // Verify team exists
  const team = await db.query.teams.findFirst({
    where: eq(teams.id, Number(teamId)),
  });
  if (!team) {
    throw new HTTPException(404, { message: `No team found with id ${teamId}` });
  }

  // Verify tier exists
  const tier = await db.query.tiers.findFirst({
    where: eq(tiers.id, Number(tierId)),
  });
  if (!tier) {
    throw new HTTPException(404, { message: `No tier found with id ${tierId}` });
  }

  // Parse and validate request body
  const body = await c.req.json<{ state: string }>();
  if (!body.state || !["COMPLETE", "INCOMPLETE", "BLOCKED"].includes(body.state)) {
    throw new HTTPException(422, { message: "Invalid state. Must be COMPLETE, INCOMPLETE, or BLOCKED" });
  }

  // Find existing completion state record
  const existing = await db.query.tierCompletionStates.findFirst({
    where: and(
      eq(tierCompletionStates.tierId, Number(tierId)),
      eq(tierCompletionStates.teamId, Number(teamId)),
    ),
  });

  const previousState = existing?.state ?? "INCOMPLETE";
  const newState = body.state as TaskStates;

  if (existing) {
    // Update existing record
    await db
      .update(tierCompletionStates)
      .set({ state: newState })
      .where(eq(tierCompletionStates.id, existing.id));
  } else {
    // Insert new record
    await db.insert(tierCompletionStates).values({
      taskId: tier.taskId,
      tierId: Number(tierId),
      teamId: Number(teamId),
      state: newState,
    });
  }

  // Send notification if tier was just marked as complete
  if (newState === "COMPLETE" && previousState !== "COMPLETE") {
    // Get task name from database
    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, tier.taskId),
    });

    if (task) {
      // Find the task in taskList by name
      const taskData = Object.values(taskList).find((t) => t.name === task.name);
      if (taskData) {
        const tierData = taskData.tiers[tier.number as keyof typeof taskData.tiers];
        if (tierData) {
          const messageData = messageBuilder.tierComplete({
            team: team.name,
            task: taskData,
            tier: tierData,
            number: tier.number,
          });
          await sendWebhookMessage(messageData);
        }
      }
    }
  }

  return c.json({ success: true });
});

// Verify team authentication
teamsRouter.post("/:teamId/verify-auth", async (c) => {
  const { teamId } = c.req.param();
  if (Number.isNaN(Number(teamId))) {
    throw new HTTPException(422, { message: `Invalid id ${teamId}` });
  }

  const body = await c.req.json<{ key: string }>();
  if (!body.key) {
    throw new HTTPException(400, { message: "Missing key in request body" });
  }

  const isValid = verifyTeamKey(Number(teamId), body.key);
  return c.json({ valid: isValid });
});

// Get all task metadata for a team
teamsRouter.get("/:teamId/metadata", async (c) => {
  const { teamId } = c.req.param();
  if (Number.isNaN(Number(teamId))) {
    throw new HTTPException(422, { message: `Invalid id ${teamId}` });
  }

  const team = await db.query.teams.findFirst({
    where: eq(teams.id, Number(teamId)),
  });

  if (!team) {
    throw new HTTPException(404, {
      message: `No team found with id ${teamId}`,
    });
  }

  const metadataRecords = await db.query.taskMetadata.findMany({
    where: eq(taskMetadata.teamId, Number(teamId)),
    with: {
      task: true,
    },
  });

  // Transform to a map keyed by task name
  const metadataMap: Record<string, Record<string, unknown>> = {};
  for (const record of metadataRecords) {
    if (record.task) {
      metadataMap[record.task.name] = record.metadata;
    }
  }

  return c.json(metadataMap);
});

// Update task metadata for a team
teamsRouter.put("/:teamId/metadata", async (c) => {
  const { teamId } = c.req.param();
  if (Number.isNaN(Number(teamId))) {
    throw new HTTPException(422, { message: `Invalid id ${teamId}` });
  }

  // Verify authentication
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new HTTPException(401, { message: "Missing or invalid authorization header" });
  }
  const key = authHeader.slice(7);
  if (!verifyTeamKey(Number(teamId), key)) {
    throw new HTTPException(403, { message: "Invalid team key" });
  }

  const team = await db.query.teams.findFirst({
    where: eq(teams.id, Number(teamId)),
  });

  if (!team) {
    throw new HTTPException(404, {
      message: `No team found with id ${teamId}`,
    });
  }

  const body = await c.req.json<Record<string, Record<string, unknown>>>();

  // Get all tasks to map names to IDs
  const allTasks = await db.select().from(tasks);
  const taskNameToId = new Map(allTasks.map((t) => [t.name, t.id]));

  // Update or insert metadata for each task
  for (const [taskName, metadata] of Object.entries(body)) {
    const taskId = taskNameToId.get(taskName);
    if (!taskId) {
      continue; // Skip unknown tasks
    }

    const existing = await db.query.taskMetadata.findFirst({
      where: and(
        eq(taskMetadata.taskId, taskId),
        eq(taskMetadata.teamId, Number(teamId)),
      ),
    });

    if (existing) {
      await db
        .update(taskMetadata)
        .set({ metadata })
        .where(eq(taskMetadata.id, existing.id));
    } else {
      await db.insert(taskMetadata).values({
        taskId,
        teamId: Number(teamId),
        metadata,
      });
    }
  }

  return c.json({ success: true });
});

export { teamsRouter };
