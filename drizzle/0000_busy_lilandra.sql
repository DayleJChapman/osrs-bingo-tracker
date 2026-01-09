CREATE TABLE `players` (
	`id` integer PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`displayName` text NOT NULL,
	`womId` integer NOT NULL,
	`teamId` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `players_username_unique` ON `players` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `players_displayName_unique` ON `players` (`displayName`);--> statement-breakpoint
CREATE UNIQUE INDEX `players_womId_unique` ON `players` (`womId`);--> statement-breakpoint
CREATE TABLE `teams` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `teams_name_unique` ON `teams` (`name`);