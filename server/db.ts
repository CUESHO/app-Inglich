import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  missionCompletions,
  worldUnlocks,
  achievements,
  gameResults,
  InsertMissionCompletion,
  InsertWorldUnlock,
  InsertAchievement,
  InsertGameResult
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Progression and unlocking functions

export async function getUserProgress(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return user.length > 0 ? user[0] : null;
}

export async function updateUserXP(userId: number, xpToAdd: number, coinsToAdd: number = 0) {
  const db = await getDb();
  if (!db) return null;

  const user = await getUserProgress(userId);
  if (!user) return null;

  const newTotalXp = (user.totalXp || 0) + xpToAdd;
  const newCoins = (user.coins || 0) + coinsToAdd;
  
  // Calculate new level (every 1000 XP = 1 level)
  const newLevel = Math.floor(newTotalXp / 1000) + 1;

  await db.update(users)
    .set({
      totalXp: newTotalXp,
      level: newLevel,
      coins: newCoins,
      lastActivityDate: new Date(),
    })
    .where(eq(users.id, userId));

  return { totalXp: newTotalXp, level: newLevel, coins: newCoins };
}

export async function completeMission(data: InsertMissionCompletion) {
  const db = await getDb();
  if (!db) return null;

  // Check if mission already completed
  const existing = await db
    .select()
    .from(missionCompletions)
    .where(
      and(
        eq(missionCompletions.userId, data.userId),
        eq(missionCompletions.missionId, data.missionId)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    // Update best score if new score is better
    if (data.bestScore && data.bestScore > (existing[0].bestScore || 0)) {
      await db
        .update(missionCompletions)
        .set({
          bestScore: data.bestScore,
          attempts: (existing[0].attempts || 0) + 1,
          updatedAt: new Date(),
        })
        .where(eq(missionCompletions.id, existing[0].id));
    }
    return existing[0];
  }

  // Insert new completion
  await db.insert(missionCompletions).values({
    ...data,
    completed: true,
    completedAt: new Date(),
  });

  // Update user XP
  await updateUserXP(data.userId, data.xpEarned || 0, data.coinsEarned || 0);

  return data;
}

export async function getCompletedMissions(userId: number, worldId?: string) {
  const db = await getDb();
  if (!db) return [];

  const query = worldId
    ? db
        .select()
        .from(missionCompletions)
        .where(
          and(
            eq(missionCompletions.userId, userId),
            eq(missionCompletions.worldId, worldId),
            eq(missionCompletions.completed, true)
          )
        )
    : db
        .select()
        .from(missionCompletions)
        .where(
          and(
            eq(missionCompletions.userId, userId),
            eq(missionCompletions.completed, true)
          )
        );

  return await query;
}

export async function unlockWorld(userId: number, worldId: string) {
  const db = await getDb();
  if (!db) return null;

  // Check if already unlocked
  const existing = await db
    .select()
    .from(worldUnlocks)
    .where(
      and(
        eq(worldUnlocks.userId, userId),
        eq(worldUnlocks.worldId, worldId)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  // Insert new unlock
  const unlock: InsertWorldUnlock = {
    userId,
    worldId,
    unlockedAt: new Date(),
  };

  await db.insert(worldUnlocks).values(unlock);
  return unlock;
}

export async function getUnlockedWorlds(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const unlocks = await db
    .select()
    .from(worldUnlocks)
    .where(eq(worldUnlocks.userId, userId));

  return unlocks.map(u => u.worldId);
}

export async function checkAndUnlockNextWorld(userId: number, currentWorldId: string) {
  const db = await getDb();
  if (!db) return null;

  // Get all completed missions for current world
  const completedMissions = await getCompletedMissions(userId, currentWorldId);

  // Check if all 10 missions are completed (each world has 10 missions)
  if (completedMissions.length >= 10) {
    // Determine next world based on order
    const worldOrder = [
      "foundation-realm",
      "action-arena",
      "experience-citadel",
      "mastery-kingdom",
      "eloquence-observatory",
      "perfection-sanctum",
      "pronunciation-theater",
      "competence-nexus",
    ];

    const currentIndex = worldOrder.indexOf(currentWorldId);
    if (currentIndex >= 0 && currentIndex < worldOrder.length - 1) {
      const nextWorldId = worldOrder[currentIndex + 1];
      return await unlockWorld(userId, nextWorldId);
    }
  }

  return null;
}

export async function saveGameResult(data: InsertGameResult) {
  const db = await getDb();
  if (!db) return null;

  await db.insert(gameResults).values(data);
  return data;
}

export async function getUserAchievements(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(achievements)
    .where(eq(achievements.userId, userId))
    .orderBy(desc(achievements.unlockedAt));
}

export async function grantAchievement(data: InsertAchievement) {
  const db = await getDb();
  if (!db) return null;

  // Check if achievement already exists
  const existing = await db
    .select()
    .from(achievements)
    .where(
      and(
        eq(achievements.userId, data.userId),
        eq(achievements.achievementType, data.achievementType)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  await db.insert(achievements).values(data);

  // Award XP for achievement
  if (data.xpReward) {
    await updateUserXP(data.userId, data.xpReward);
  }

  return data;
}
