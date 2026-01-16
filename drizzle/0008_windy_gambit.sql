CREATE UNIQUE INDEX `tasks_name_unique` ON `tasks` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `tiers_taskId_number_unique` ON `tiers` (`taskId`,`number`);