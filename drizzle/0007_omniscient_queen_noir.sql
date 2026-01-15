CREATE TABLE `tierCompletionStates` (
	`id` integer PRIMARY KEY NOT NULL,
	`taskId` integer NOT NULL,
	`tierId` integer NOT NULL,
	`teamId` integer NOT NULL,
	`state` text DEFAULT 'INCOMPLETE'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tierCompletionStates_tierId_teamId_unique` ON `tierCompletionStates` (`tierId`,`teamId`);--> statement-breakpoint
CREATE TABLE `tiers` (
	`id` integer PRIMARY KEY NOT NULL,
	`taskId` integer NOT NULL,
	`number` integer NOT NULL,
	`description` text DEFAULT '',
	`points` integer NOT NULL,
	`requirements` text DEFAULT '[]'
);
--> statement-breakpoint
DROP TABLE `taskStates`;--> statement-breakpoint
DROP INDEX `tasks_name_tier_unique`;--> statement-breakpoint
ALTER TABLE `tasks` ADD `label` text DEFAULT '';--> statement-breakpoint
ALTER TABLE `tasks` ADD `description` text DEFAULT '';--> statement-breakpoint
ALTER TABLE `tasks` DROP COLUMN `tier`;--> statement-breakpoint
ALTER TABLE `tasks` DROP COLUMN `pointValue`;