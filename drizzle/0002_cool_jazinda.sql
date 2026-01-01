CREATE TABLE `missionCompletions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`missionId` varchar(64) NOT NULL,
	`worldId` varchar(64) NOT NULL,
	`completed` boolean NOT NULL DEFAULT false,
	`xpEarned` int NOT NULL DEFAULT 0,
	`coinsEarned` int NOT NULL DEFAULT 0,
	`attempts` int NOT NULL DEFAULT 0,
	`bestScore` int NOT NULL DEFAULT 0,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `missionCompletions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `worldUnlocks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`worldId` varchar(64) NOT NULL,
	`unlockedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `worldUnlocks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `userProgress`;