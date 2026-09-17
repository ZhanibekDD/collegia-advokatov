import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const advocates = sqliteTable(
  "advocates",
  {
    id: text("id").primaryKey(),
    sourceId: integer("source_id").notNull(),
    name: text("name").notNull(),
    region: text("region").notNull().default("область Жетісу"),
    consultation: text("consultation").notNull(),
    contactsJson: text("contacts_json").notNull().default("[]"),
    ggup2026: integer("ggup_2026", { mode: "boolean" }).notNull().default(false),
    ggupSourceId: integer("ggup_source_id"),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("idx_advocates_source_id").on(table.sourceId),
    index("idx_advocates_active_name").on(table.active, table.name),
    index("idx_advocates_consultation").on(table.consultation),
  ],
);

export const newsPosts = sqliteTable(
  "news_posts",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    kind: text("kind", { enum: ["news", "event"] }).notNull().default("news"),
    status: text("status", { enum: ["draft", "published", "archived"] }).notNull().default("draft"),
    titleRu: text("title_ru").notNull(),
    titleKk: text("title_kk").notNull().default(""),
    excerptRu: text("excerpt_ru").notNull().default(""),
    excerptKk: text("excerpt_kk").notNull().default(""),
    contentRu: text("content_ru").notNull().default(""),
    contentKk: text("content_kk").notNull().default(""),
    imageUrl: text("image_url").notNull().default(""),
    sourceUrl: text("source_url").notNull().default(""),
    sourceLabel: text("source_label").notNull().default(""),
    eventDate: text("event_date"),
    publishedAt: text("published_at"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("idx_news_posts_slug").on(table.slug),
    index("idx_news_posts_status_date").on(table.status, table.publishedAt),
    index("idx_news_posts_kind_event_date").on(table.kind, table.eventDate),
  ],
);

export const auditLog = sqliteTable(
  "audit_log",
  {
    id: text("id").primaryKey(),
    actorType: text("actor_type", { enum: ["admin", "telegram"] }).notNull(),
    actorId: text("actor_id").notNull(),
    action: text("action").notNull(),
    entityType: text("entity_type", { enum: ["advocate", "news"] }).notNull(),
    entityId: text("entity_id").notNull(),
    payloadJson: text("payload_json").notNull().default("{}"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("idx_audit_log_created_at").on(table.createdAt)],
);
