import { taskList } from "@/lib/tasks/task";
import { Hono } from "hono";

const tasksRouter = new Hono();

tasksRouter.get("", async (c) => {
  return c.json(taskList);
});

tasksRouter.get(":taskKey", async (c) => {
  const { taskKey } = c.req.param();
  return c.json(taskList[taskKey as keyof typeof taskList]);
});

export { tasksRouter };
