CREATE TABLE `drops` (
	`id` integer PRIMARY KEY NOT NULL,
	`teamId` integer NOT NULL,
	`playerId` integer NOT NULL,
	`source` text NOT NULL,
	`item` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `taskMetadata` (
	`id` integer PRIMARY KEY NOT NULL,
	`taskId` integer NOT NULL,
	`teamId` integer NOT NULL,
	`metadata` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `taskStates` (
	`id` integer PRIMARY KEY NOT NULL,
	`taskId` integer NOT NULL,
	`teamId` integer NOT NULL,
	`state` text DEFAULT 'INCOMPLETE',
	`completedAt` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `taskStates_taskId_teamId_unique` ON `taskStates` (`taskId`,`teamId`);--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`tier` integer NOT NULL,
	`pointValue` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `teams` ADD `points` integer DEFAULT 0 NOT NULL;