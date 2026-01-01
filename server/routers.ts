import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { transcribeAudio } from "./_core/voiceTranscription";
import { generateImage } from "./_core/imageGeneration";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // AI Tutor procedures
  tutor: router({
    // Get personalized explanation for a concept
    explainConcept: protectedProcedure
      .input(z.object({
        concept: z.string(),
        context: z.string().optional(),
        userLevel: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { concept, context, userLevel } = input;

        const systemPrompt = `You are an enthusiastic English language tutor for the "Inglich 1, 2 x 3" gamified learning platform. 
Your role is to provide clear, encouraging, and practical explanations in a motivational tone with game metaphors.
Keep explanations concise (2-3 paragraphs) and use examples.
${userLevel ? `The student is at ${userLevel} level.` : ''}`;

        const userPrompt = context 
          ? `Explain "${concept}" in the context of: ${context}`
          : `Explain "${concept}" to help me understand it better.`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        });

        return {
          explanation: response.choices[0]?.message?.content || "I couldn't generate an explanation at this time.",
        };
      }),

    // Get feedback on user's error
    getFeedback: protectedProcedure
      .input(z.object({
        question: z.string(),
        userAnswer: z.string(),
        correctAnswer: z.string(),
        topic: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { question, userAnswer, correctAnswer, topic } = input;

        const systemPrompt = `You are an encouraging English tutor providing feedback on student errors.
Be supportive and explain WHY the correct answer is right and what the student can learn from their mistake.
Use a friendly, motivational tone with game metaphors. Keep it concise (2-3 sentences).`;

        const userPrompt = `Question: "${question}"
Student's answer: "${userAnswer}"
Correct answer: "${correctAnswer}"
${topic ? `Topic: ${topic}` : ''}

Provide encouraging feedback explaining the error and how to improve.`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        });

        return {
          feedback: response.choices[0]?.message?.content || "Keep practicing! You're making progress.",
        };
      }),

    // Get hint for a question
    getHint: protectedProcedure
      .input(z.object({
        question: z.string(),
        context: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { question, context } = input;

        const systemPrompt = `You are a helpful tutor providing hints (not full answers) to students.
Give a subtle clue that guides them toward the answer without revealing it completely.
Use encouraging language and game metaphors. Keep it to 1-2 sentences.`;

        const userPrompt = context
          ? `Give me a hint for this question: "${question}" (Context: ${context})`
          : `Give me a hint for this question: "${question}"`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        });

        return {
          hint: response.choices[0]?.message?.content || "Think about the context and try again!",
        };
      }),
  }),

  // Pronunciation practice procedures
  pronunciation: router({
    // Upload audio file to S3
    uploadAudio: protectedProcedure
      .input(z.object({
        audioData: z.string(), // base64 encoded audio
        missionId: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { audioData, missionId } = input;

        try {
          // Convert base64 to buffer
          const base64Data = audioData.split(',')[1];
          const buffer = Buffer.from(base64Data, 'base64');

          // Upload to S3
          const { storagePut } = await import('./storage');
          const timestamp = Date.now();
          const fileKey = `pronunciation/${ctx.user.id}/${missionId}-${timestamp}.webm`;
          
          const result = await storagePut(fileKey, buffer, 'audio/webm');

          return {
            audioUrl: result.url,
            fileKey,
          };
        } catch (error) {
          console.error('Error uploading audio:', error);
          throw new Error('Failed to upload audio');
        }
      }),

    // Analyze pronunciation from audio
    analyzePronunciation: protectedProcedure
      .input(z.object({
        audioUrl: z.string(),
        targetPhrase: z.string(),
        language: z.string().default("en"),
      }))
      .mutation(async ({ input, ctx }) => {
        const { audioUrl, targetPhrase, language } = input;

        try {
          // Transcribe the audio
          const transcription = await transcribeAudio({
            audioUrl,
            language,
            prompt: targetPhrase,
          });

          // Check if transcription was successful
          if ('error' in transcription) {
            return {
              transcription: "",
              score: 0,
              feedback: "Unable to transcribe audio. Please try again.",
              targetPhrase,
            };
          }

          // Use LLM to analyze pronunciation
          const systemPrompt = `You are a pronunciation expert analyzing a student's English pronunciation.
Compare the transcribed text with the target phrase and provide specific feedback on:
1. Accuracy (how close to the target)
2. Common phoneme issues for Spanish speakers
3. Rhythm and stress patterns
4. Specific sounds to practice

Provide a score from 0-100 and constructive feedback. Be encouraging!`;

          const userPrompt = `Target phrase: "${targetPhrase}"
Transcribed speech: "${transcription.text}"

Analyze the pronunciation and provide feedback.`;

          const response = await invokeLLM({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
          });

          const feedback = response.choices[0]?.message?.content || "Good effort! Keep practicing.";

          // Calculate simple score based on similarity
          const similarity = calculateSimilarity(targetPhrase.toLowerCase(), transcription.text.toLowerCase());
          const score = Math.round(similarity * 100);

          return {
            transcription: transcription.text,
            score,
            feedback,
            targetPhrase,
          };
        } catch (error) {
          console.error("Pronunciation analysis error:", error);
          return {
            transcription: "",
            score: 0,
            feedback: "Unable to analyze pronunciation at this time. Please try again.",
            targetPhrase,
          };
        }
      }),
  }),

  // Image generation procedures
  illustration: router({
    // Generate illustration for a content block
    generateBlockIllustration: protectedProcedure
      .input(z.object({
        description: z.string(),
        worldTheme: z.string(),
        style: z.string().default("digital art, colorful, educational, game-style"),
      }))
      .mutation(async ({ input }) => {
        const { description, worldTheme, style } = input;

        const prompt = `${description}. Theme: ${worldTheme}. Style: ${style}. High quality, detailed, vibrant colors.`;

        try {
          const result = await generateImage({
            prompt,
          });

          return {
            imageUrl: result.url,
            prompt,
          };
        } catch (error) {
          console.error("Image generation error:", error);
          return {
            imageUrl: "",
            prompt,
            error: "Unable to generate image at this time.",
          };
        }
      }),
  }),

  // Progress and unlocking procedures
  progress: router({
    getMyProgress: protectedProcedure.query(async ({ ctx }) => {
      const { getUserProgress, getUnlockedWorlds, getUserAchievements } = await import('./db');
      const progress = await getUserProgress(ctx.user.id);
      const unlockedWorlds = await getUnlockedWorlds(ctx.user.id);
      const userAchievements = await getUserAchievements(ctx.user.id);
      
      return {
        level: progress?.level || 1,
        totalXp: progress?.totalXp || 0,
        coins: progress?.coins || 0,
        achievements: userAchievements.length,
        unlockedWorlds,
      };
    }),

    completeMission: protectedProcedure
      .input(z.object({
        missionId: z.string(),
        worldId: z.string(),
        score: z.number(),
        xpEarned: z.number(),
        coinsEarned: z.number().default(0),
      }))
      .mutation(async ({ ctx, input }) => {
        const { completeMission, checkAndUnlockNextWorld } = await import('./db');
        
        const completion = await completeMission({
          userId: ctx.user.id,
          missionId: input.missionId,
          worldId: input.worldId,
          bestScore: input.score,
          xpEarned: input.xpEarned,
          coinsEarned: input.coinsEarned,
          attempts: 1,
        });

        // Check if next world should be unlocked
        const nextWorldUnlock = await checkAndUnlockNextWorld(ctx.user.id, input.worldId);

        return {
          completion,
          nextWorldUnlocked: nextWorldUnlock ? true : false,
        };
      }),

    getCompletedMissions: protectedProcedure
      .input(z.object({
        worldId: z.string().optional(),
      }))
      .query(async ({ ctx, input }) => {
        const { getCompletedMissions } = await import('./db');
        return await getCompletedMissions(ctx.user.id, input.worldId);
      }),

    unlockWorld: protectedProcedure
      .input(z.object({
        worldId: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { unlockWorld } = await import('./db');
        await unlockWorld(ctx.user.id, input.worldId);
        return { success: true };
      }),
  }),

  // Streak procedures
  streak: router({
    getMyStreak: protectedProcedure.query(async ({ ctx }) => {
      const { getUserStreak } = await import('./db');
      return await getUserStreak(ctx.user.id);
    }),

    checkIn: protectedProcedure.mutation(async ({ ctx }) => {
      const { checkInDaily } = await import('./db');
      return await checkInDaily(ctx.user.id);
    }),
  }),

  // Shop procedures
  shop: router({
    purchaseItem: protectedProcedure
      .input(z.object({
        itemId: z.string(),
        itemType: z.string(),
        coinsCost: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { getUserProgress, updateUserCoins, createPurchase } = await import('./db');
        
        // Check if user has enough coins
        const progress = await getUserProgress(ctx.user.id);
        if (!progress || progress.coins < input.coinsCost) {
          throw new Error('Not enough coins');
        }

        // Deduct coins and create purchase
        await updateUserCoins(ctx.user.id, -input.coinsCost);
        await createPurchase({
          userId: ctx.user.id,
          itemId: input.itemId,
          itemType: input.itemType,
          coinsCost: input.coinsCost,
        });

        return { success: true };
      }),

    getUserPurchases: protectedProcedure.query(async ({ ctx }) => {
      const { getUserPurchases } = await import('./db');
      return await getUserPurchases(ctx.user.id);
    }),
  }),

  // Content generation procedures
  content: router({
    generateMissionContent: protectedProcedure
      .input(z.object({
        missionId: z.string(),
        worldId: z.string(),
        worldName: z.string(),
        worldTheme: z.string(),
        cefrLevel: z.string(),
        missionTitle: z.string(),
        missionObjective: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { generateMissionContent } = await import('./contentGenerator');
        return await generateMissionContent(
          input.missionId,
          input.worldId,
          input.worldName,
          input.worldTheme,
          input.cefrLevel,
          input.missionTitle,
          input.missionObjective
        );
      }),

    generateBossBattle: protectedProcedure
      .input(z.object({
        worldId: z.string(),
        worldName: z.string(),
        worldTheme: z.string(),
        cefrLevel: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { generateBossBattle } = await import('./contentGenerator');
        return await generateBossBattle(
          input.worldId,
          input.worldName,
          input.worldTheme,
          input.cefrLevel
        );
      }),
  }),
});

export type AppRouter = typeof appRouter;

// Helper function to calculate string similarity (simple Levenshtein-based)
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) {
    return 1.0;
  }

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}
