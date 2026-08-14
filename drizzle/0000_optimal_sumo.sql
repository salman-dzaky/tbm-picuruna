CREATE TABLE `books` (
	`id` text PRIMARY KEY NOT NULL,
	`inventory_number` text,
	`title` text NOT NULL,
	`author` text,
	`illustrator` text,
	`publisher` text,
	`publication_year` integer,
	`number_of_copies` integer DEFAULT 1 NOT NULL,
	`subject` text,
	`origin` text,
	`isbn` text,
	`synopsis` text,
	`category_id` text NOT NULL,
	`location_rack` text,
	`call_number` text,
	`status` text DEFAULT 'TERSEDIA' NOT NULL,
	`cover_url` text,
	`cover_public_id` text,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_books_category` ON `books` (`category_id`);--> statement-breakpoint
CREATE INDEX `idx_books_status` ON `books` (`status`);--> statement-breakpoint
CREATE INDEX `idx_books_title_author` ON `books` (`title`,`author`);--> statement-breakpoint
CREATE INDEX `idx_books_inventory_number` ON `books` (`inventory_number`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);