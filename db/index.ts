import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import { drizzle } from "drizzle-orm/sqlite-proxy";
import * as schema from "./schema";

let database: ReturnType<typeof createDatabase> | null = null;

function createDatabase() {
  const filename = resolve(process.env.SQLITE_PATH ?? "var/kaoj.sqlite");
  mkdirSync(dirname(filename), { recursive: true });

  const sqlite = new DatabaseSync(filename);
  sqlite.exec("PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000; PRAGMA foreign_keys = ON;");
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS advocates (
      id TEXT PRIMARY KEY NOT NULL,
      source_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      region TEXT DEFAULT 'область Жетісу' NOT NULL,
      consultation TEXT NOT NULL,
      contacts_json TEXT DEFAULT '[]' NOT NULL,
      ggup_2026 INTEGER DEFAULT 0 NOT NULL,
      ggup_source_id INTEGER,
      active INTEGER DEFAULT 1 NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_advocates_source_id ON advocates (source_id);
    CREATE INDEX IF NOT EXISTS idx_advocates_active_name ON advocates (active, name);
    CREATE INDEX IF NOT EXISTS idx_advocates_consultation ON advocates (consultation);

    CREATE TABLE IF NOT EXISTS news_posts (
      id TEXT PRIMARY KEY NOT NULL,
      slug TEXT NOT NULL,
      kind TEXT DEFAULT 'news' NOT NULL,
      status TEXT DEFAULT 'draft' NOT NULL,
      title_ru TEXT NOT NULL,
      title_kk TEXT DEFAULT '' NOT NULL,
      excerpt_ru TEXT DEFAULT '' NOT NULL,
      excerpt_kk TEXT DEFAULT '' NOT NULL,
      content_ru TEXT DEFAULT '' NOT NULL,
      content_kk TEXT DEFAULT '' NOT NULL,
      image_url TEXT DEFAULT '' NOT NULL,
      source_url TEXT DEFAULT '' NOT NULL,
      source_label TEXT DEFAULT '' NOT NULL,
      event_date TEXT,
      published_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_news_posts_slug ON news_posts (slug);
    CREATE INDEX IF NOT EXISTS idx_news_posts_status_date ON news_posts (status, published_at);
    CREATE INDEX IF NOT EXISTS idx_news_posts_kind_event_date ON news_posts (kind, event_date);

    CREATE TABLE IF NOT EXISTS audit_log (
      id TEXT PRIMARY KEY NOT NULL,
      actor_type TEXT NOT NULL,
      actor_id TEXT NOT NULL,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      payload_json TEXT DEFAULT '{}' NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log (created_at);
  `);

  const query = async (sql: string, params: SQLInputValue[], method: "run" | "all" | "values" | "get") => {
    const statement = sqlite.prepare(sql);
    if (method === "values" || method === "all") {
      statement.setReturnArrays(true);
      return { rows: statement.all(...params) };
    }
    if (method === "get") {
      statement.setReturnArrays(true);
      return { rows: statement.get(...params) };
    }
    if (method === "run") {
      statement.run(...params);
      return { rows: [] };
    }
    return { rows: [] };
  };

  return drizzle(query as Parameters<typeof drizzle>[0], { schema });
}

export function getDb() {
  if (!database) {
    database = createDatabase();
  }
  return database;
}
