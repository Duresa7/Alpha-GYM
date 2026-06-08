import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

const dbFileName = process.env.DB_FILE_NAME?.trim() || "./data/alpha-gym.db";
const dbPath = path.isAbsolute(dbFileName)
  ? dbFileName
  : path.resolve(/* turbopackIgnore: true */ process.cwd(), dbFileName);

const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");

function ensureColumn(tableName: string, columnName: string, definition: string) {
  const table = sqlite
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?")
    .get(tableName);

  if (!table) {
    return;
  }

  const columns = sqlite.prepare(`PRAGMA table_info(${tableName})`).all() as {
    name: string;
  }[];

  if (columns.some((column) => column.name === columnName)) {
    return;
  }

  try {
    sqlite.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.toLowerCase().includes("duplicate column")
    ) {
      return;
    }

    throw error;
  }
}

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS user_settings (
    id integer PRIMARY KEY AUTOINCREMENT,
    key text NOT NULL UNIQUE,
    value text NOT NULL
  );
`);

ensureColumn("workout_template_items", "group_label", "text");
ensureColumn("planned_workout_items", "group_label", "text");

export const db = drizzle({ client: sqlite, schema });
