CREATE TABLE `advocates` (
	`id` text PRIMARY KEY NOT NULL,
	`source_id` integer NOT NULL,
	`name` text NOT NULL,
	`region` text DEFAULT 'область Жетісу' NOT NULL,
	`consultation` text NOT NULL,
	`contacts_json` text DEFAULT '[]' NOT NULL,
	`ggup_2026` integer DEFAULT false NOT NULL,
	`ggup_source_id` integer,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_advocates_source_id` ON `advocates` (`source_id`);--> statement-breakpoint
CREATE INDEX `idx_advocates_active_name` ON `advocates` (`active`,`name`);--> statement-breakpoint
CREATE INDEX `idx_advocates_consultation` ON `advocates` (`consultation`);--> statement-breakpoint
CREATE TABLE `audit_log` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_type` text NOT NULL,
	`actor_id` text NOT NULL,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`payload_json` text DEFAULT '{}' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_audit_log_created_at` ON `audit_log` (`created_at`);--> statement-breakpoint
CREATE TABLE `news_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`kind` text DEFAULT 'news' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`title_ru` text NOT NULL,
	`title_kk` text DEFAULT '' NOT NULL,
	`excerpt_ru` text DEFAULT '' NOT NULL,
	`excerpt_kk` text DEFAULT '' NOT NULL,
	`content_ru` text DEFAULT '' NOT NULL,
	`content_kk` text DEFAULT '' NOT NULL,
	`event_date` text,
	`published_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_news_posts_slug` ON `news_posts` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_news_posts_status_date` ON `news_posts` (`status`,`published_at`);--> statement-breakpoint
CREATE INDEX `idx_news_posts_kind_event_date` ON `news_posts` (`kind`,`event_date`);--> statement-breakpoint
PRAGMA optimize;
