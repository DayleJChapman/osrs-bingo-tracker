import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema.ts";

const filename = Bun.env["SQLITE_FILENAME"] ?? "sqlite.db";
const sqlite = new Database(filename);

export const db = drizzle(sqlite, { schema });
