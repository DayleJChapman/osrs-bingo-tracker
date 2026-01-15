import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/lib/db/schema",
  dbCredentials: {
    url: Bun.env["SQLITE_FILENAME"] ?? "sqlite.db",
  },
});
