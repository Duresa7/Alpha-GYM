import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

const dbFileName = process.env.DB_FILE_NAME?.trim() || "./data/alpha-gym.db";
const dbPath = path.isAbsolute(dbFileName)
  ? dbFileName
  : path.resolve(process.cwd(), dbFileName);

const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });
