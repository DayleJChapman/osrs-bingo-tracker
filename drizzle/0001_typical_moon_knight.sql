CREATE TABLE `xpGains` (
	`id` integer PRIMARY KEY NOT NULL,
	`playerId` integer NOT NULL,
	`teamId` integer NOT NULL,
	`skill` text NOT NULL,
	`amount` integer NOT NULL
);
