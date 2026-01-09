import { Hono } from "hono";
import { teamsRouter } from "./routes/teams";
import { playersRouter } from "./routes/players";

const hono = new Hono({ strict: false }).basePath("/api");

hono.get("/", (c) => c.text("hi"));
hono.route("/teams", teamsRouter);
hono.route("/players", playersRouter);

export { hono };
