import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  
  // Gamification fields
  totalXp: int("totalXp").default(0).notNull(),
  level: int("level").default(1).notNull(),
  coins: int("coins").default(0).notNull(),
  currentStreak: int("currentStreak").default(0).notNull(),
  longestStreak: int("longestStreak").default(0).notNull(),
  lastActivityDate: timestamp("lastActivityDate"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Mission completions table for tracking which missions the user has completed
 */
export const missionCompletions = mysqlTable("missionCompletions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  missionId: varchar("missionId", { length: 64 }).notNull(),
  worldId: varchar("worldId", { length: 64 }).notNull(),
  completed: boolean("completed").default(false).notNull(),
  xpEarned: int("xpEarned").default(0).notNull(),
  coinsEarned: int("coinsEarned").default(0).notNull(),
  attempts: int("attempts").default(0).notNull(),
  bestScore: int("bestScore").default(0).notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MissionCompletion = typeof missionCompletions.$inferSelect;
export type InsertMissionCompletion = typeof missionCompletions.$inferInsert;

/**
 * World unlocks table for tracking which worlds are available to the user
 */
export const worldUnlocks = mysqlTable("worldUnlocks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  worldId: varchar("worldId", { length: 64 }).notNull(),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
});

export type WorldUnlock = typeof worldUnlocks.$inferSelect;
export type InsertWorldUnlock = typeof worldUnlocks.$inferInsert;

/**
 * Achievements and medals
 */
export const achievements = mysqlTable("achievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  achievementType: varchar("achievementType", { length: 64 }).notNull(), // e.g., "first_mission", "world_complete", "streak_7"
  achievementName: varchar("achievementName", { length: 128 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 64 }), // emoji or icon name
  xpReward: int("xpReward").default(0).notNull(),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
});

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;

/**
 * Quiz and minigame results
 */
export const gameResults = mysqlTable("gameResults", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  missionId: varchar("missionId", { length: 64 }).notNull(),
  gameType: varchar("gameType", { length: 64 }).notNull(), // "quiz", "puzzle", "boss_battle", etc.
  score: int("score").notNull(),
  maxScore: int("maxScore").notNull(),
  timeSpent: int("timeSpent"), // in seconds
  correctAnswers: int("correctAnswers"),
  totalQuestions: int("totalQuestions"),
  xpEarned: int("xpEarned").default(0).notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});

export type GameResult = typeof gameResults.$inferSelect;
export type InsertGameResult = typeof gameResults.$inferInsert;

/**
 * AI Tutor interactions and feedback
 */
export const tutorInteractions = mysqlTable("tutorInteractions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  missionId: varchar("missionId", { length: 64 }),
  userQuestion: text("userQuestion"),
  tutorResponse: text("tutorResponse"),
  contextType: varchar("contextType", { length: 64 }), // "error_explanation", "hint", "general_help"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TutorInteraction = typeof tutorInteractions.$inferSelect;
export type InsertTutorInteraction = typeof tutorInteractions.$inferInsert;

/**
 * Pronunciation practice recordings
 */
export const pronunciationRecordings = mysqlTable("pronunciationRecordings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  missionId: varchar("missionId", { length: 64 }).notNull(),
  audioUrl: varchar("audioUrl", { length: 512 }).notNull(),
  targetPhrase: text("targetPhrase").notNull(),
  transcription: text("transcription"),
  score: int("score"), // 0-100
  feedback: text("feedback"), // JSON with phoneme-level feedback
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PronunciationRecording = typeof pronunciationRecordings.$inferSelect;
export type InsertPronunciationRecording = typeof pronunciationRecordings.$inferInsert;

/**
 * Shop items available for purchase
 */
export const shopItems = mysqlTable("shopItems", {
  id: int("id").autoincrement().primaryKey(),
  itemType: mysqlEnum("itemType", ["hint", "xp_multiplier", "avatar", "world_unlock", "streak_freeze"]).notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  coinCost: int("coinCost").notNull(),
  duration: int("duration"), // For temporary items like XP multipliers (in minutes)
  multiplier: int("multiplier"), // For XP multipliers (e.g., 2x, 3x)
  imageUrl: varchar("imageUrl", { length: 512 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ShopItem = typeof shopItems.$inferSelect;
export type InsertShopItem = typeof shopItems.$inferInsert;

/**
 * User purchases from the shop
 */
export const userPurchases = mysqlTable("userPurchases", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  itemId: int("itemId").notNull(),
  itemType: varchar("itemType", { length: 64 }).notNull(),
  coinsCost: int("coinsCost").notNull(),
  purchasedAt: timestamp("purchasedAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"), // For temporary items
  isActive: boolean("isActive").default(true).notNull(),
  usedAt: timestamp("usedAt"),
});

export type UserPurchase = typeof userPurchases.$inferSelect;
export type InsertUserPurchase = typeof userPurchases.$inferInsert;

/**
 * Daily streak tracking
 */
export const dailyStreaks = mysqlTable("dailyStreaks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  currentStreak: int("currentStreak").default(0).notNull(),
  longestStreak: int("longestStreak").default(0).notNull(),
  lastCheckIn: timestamp("lastCheckIn"),
  streakFreezeUsed: boolean("streakFreezeUsed").default(false).notNull(),
  totalCheckIns: int("totalCheckIns").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DailyStreak = typeof dailyStreaks.$inferSelect;
export type InsertDailyStreak = typeof dailyStreaks.$inferInsert;

/**
 * Streak rewards claimed by users
 */
export const streakRewards = mysqlTable("streakRewards", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  streakDay: int("streakDay").notNull(), // Day of streak when reward was claimed
  rewardType: varchar("rewardType", { length: 64 }).notNull(), // "coins", "xp", "power_up"
  rewardAmount: int("rewardAmount"),
  claimedAt: timestamp("claimedAt").defaultNow().notNull(),
});

export type StreakReward = typeof streakRewards.$inferSelect;
export type InsertStreakReward = typeof streakRewards.$inferInsert;
