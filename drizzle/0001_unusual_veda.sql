CREATE TABLE `achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`achievementType` varchar(64) NOT NULL,
	`achievementName` varchar(128) NOT NULL,
	`description` text,
	`icon` varchar(64),
	`xpReward` int NOT NULL DEFAULT 0,
	`unlockedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `achievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gameResults` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`missionId` varchar(64) NOT NULL,
	`gameType` varchar(64) NOT NULL,
	`score` int NOT NULL,
	`maxScore` int NOT NULL,
	`timeSpent` int,
	`correctAnswers` int,
	`totalQuestions` int,
	`xpEarned` int NOT NULL DEFAULT 0,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `gameResults_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pronunciationRecordings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`missionId` varchar(64) NOT NULL,
	`audioUrl` varchar(512) NOT NULL,
	`targetPhrase` text NOT NULL,
	`transcription` text,
	`score` int,
	`feedback` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pronunciationRecordings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tutorInteractions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`missionId` varchar(64),
	`userQuestion` text,
	`tutorResponse` text,
	`contextType` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tutorInteractions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`missionId` varchar(64) NOT NULL,
	`worldId` varchar(64) NOT NULL,
	`completed` boolean NOT NULL DEFAULT false,
	`xpEarned` int NOT NULL DEFAULT 0,
	`attempts` int NOT NULL DEFAULT 0,
	`bestScore` int NOT NULL DEFAULT 0,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userProgress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `totalXp` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `level` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `coins` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `currentStreak` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `longestStreak` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `lastActivityDate` timestamp;