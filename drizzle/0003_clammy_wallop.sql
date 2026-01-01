CREATE TABLE `dailyStreaks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`currentStreak` int NOT NULL DEFAULT 0,
	`longestStreak` int NOT NULL DEFAULT 0,
	`lastCheckIn` timestamp,
	`streakFreezeUsed` boolean NOT NULL DEFAULT false,
	`totalCheckIns` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dailyStreaks_id` PRIMARY KEY(`id`),
	CONSTRAINT `dailyStreaks_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `shopItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`itemType` enum('hint','xp_multiplier','avatar','world_unlock','streak_freeze') NOT NULL,
	`name` varchar(128) NOT NULL,
	`description` text,
	`coinCost` int NOT NULL,
	`duration` int,
	`multiplier` int,
	`imageUrl` varchar(512),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `shopItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `streakRewards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`streakDay` int NOT NULL,
	`rewardType` varchar(64) NOT NULL,
	`rewardAmount` int,
	`claimedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `streakRewards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userPurchases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`itemId` int NOT NULL,
	`itemType` varchar(64) NOT NULL,
	`coinsCost` int NOT NULL,
	`purchasedAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	`isActive` boolean NOT NULL DEFAULT true,
	`usedAt` timestamp,
	CONSTRAINT `userPurchases_id` PRIMARY KEY(`id`)
);
