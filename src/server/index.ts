import { Hono } from "hono";
import { teamsRouter } from "./routes/teams";
import { playersRouter } from "./routes/players";
import { gainsRouter } from "./routes/gains";
import { tasksRouter } from "./routes/tasks";

const hono = new Hono({ strict: false }).basePath("/api");

hono.get("/", (c) => c.text("hi"));
hono.route("/teams", teamsRouter);
hono.route("/players", playersRouter);
hono.route("/gains", gainsRouter);
hono.route("/tasks", tasksRouter);

export { hono };
