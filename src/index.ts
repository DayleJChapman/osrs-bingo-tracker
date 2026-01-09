import { serve } from "bun";
import index from "./index.html";
import { hono } from "./server";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    // Use hono server for handling backend requests
    "/api/*": hono.fetch,
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

const pollerProc = Bun.spawn({
  cmd: ["bun", "./src/lib/poller"],
  stdout: "inherit",
});

console.log(`🚀 Server running at ${server.url}`);
