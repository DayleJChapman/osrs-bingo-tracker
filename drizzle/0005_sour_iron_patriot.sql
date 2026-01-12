CREATE TABLE `bossKc` (
	`id` integer PRIMARY KEY NOT NULL,
	`playerId` integer NOT NULL,
	`teamId` integer NOT NULL,
	`boss` text NOT NULL,
	`amount` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bossKc_playerId_boss_unique` ON `bossKc` (`playerId`,`boss`);