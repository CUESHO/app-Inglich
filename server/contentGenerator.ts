import { invokeLLM } from "./_core/llm";

export interface GeneratedMissionContent {
  blocks: Array<{
    title: string;
    subtitle: string;
    content: string;
    minigame?: {
      type: string;
      title: string;
      instructions: string;
      xpReward: number;
      data: any;
    };
    quiz?: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
      xpReward: number;
    }>;
  }>;
  estimatedTime: number;
}

export interface GeneratedBossBattle {
  phases: Array<{
    phaseNumber: number;
    title: string;
    description: string;
    challenges: Array<{
      type: string;
      question: string;
      options?: string[];
      correctAnswer: any;
      explanation: string;
    }>;
  }>;
  totalXpReward: number;
}

/**
 * Generate complete mission content using AI
 */
export async function generateMissionContent(
  missionId: string,
  worldId: string,
  worldName: string,
  worldTheme: string,
  cefrLevel: string,
  missionTitle: string,
  missionObjective: string
): Promise<GeneratedMissionContent> {
  const systemPrompt = `You are an expert English language teacher and game designer creating engaging, gamified English learning content.

Context:
- World: ${worldName} (${worldTheme})
- CEFR Level: ${cefrLevel}
- Mission: ${missionTitle}
- Objective: ${missionObjective}

Create a complete mission course with 3-4 thematic blocks. Each block should:
1. Have an engaging title and subtitle
2. Include educational content (explanations, examples, tips) in markdown format
3. Include ONE minigame (text-construction, matching, dialogue-choice, or pronunciation-practice)
4. Include 2-3 quiz questions to test understanding

Focus on USA English and use game metaphors. Keep content practical and motivating.

Return ONLY valid JSON in this exact format:
{
  "blocks": [
    {
      "title": "Block Title",
      "subtitle": "Block subtitle",
      "content": "## Educational Content\\n\\nMarkdown formatted content with examples...",
      "minigame": {
        "type": "text-construction",
        "title": "Minigame Title",
        "instructions": "Clear instructions",
        "xpReward": 50,
        "data": {
          "question": "Question text",
          "words": ["word1", "word2", "word3"],
          "correctOrder": ["word1", "word2"]
        }
      },
      "quiz": [
        {
          "question": "Question text?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0,
          "explanation": "Why this is correct",
          "xpReward": 25
        }
      ]
    }
  ],
  "estimatedTime": 15
}

Minigame types and their data structures:

1. text-construction: { question: string, words: string[], correctOrder: string[] }
   Example:
   {
     "question": "Build the sentence: 'How are you?'",
     "words": ["you", "How", "?", "are"],
     "correctOrder": ["How", "are", "you", "?"]
   }

2. matching: { pairs: [{ left: string, right: string, correctMatch: boolean }] }
   Example:
   {
     "pairs": [
       { "left": "Morning", "right": "Good morning", "correctMatch": true },
       { "left": "Afternoon", "right": "Good afternoon", "correctMatch": true },
       { "left": "Evening", "right": "Good evening", "correctMatch": true }
     ]
   }

3. dialogue-choice: { scenario: string, dialogue: string, options: string[], correctAnswers: number[], feedback: string[] }

4. pronunciation-practice: { targetPhrase: string, missionId: string }

IMPORTANT: Always include the 'words' array in text-construction minigames!`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Generate complete mission content for: ${missionTitle}` },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "mission_content",
        strict: true,
        schema: {
          type: "object",
          properties: {
            blocks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  subtitle: { type: "string" },
                  content: { type: "string" },
                  minigame: {
                    type: "object",
                    properties: {
                      type: { type: "string" },
                      title: { type: "string" },
                      instructions: { type: "string" },
                      xpReward: { type: "number" },
                      data: { type: "object", additionalProperties: true },
                    },
                    required: ["type", "title", "instructions", "xpReward", "data"],
                    additionalProperties: false,
                  },
                  quiz: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        question: { type: "string" },
                        options: { type: "array", items: { type: "string" } },
                        correctAnswer: { type: "number" },
                        explanation: { type: "string" },
                        xpReward: { type: "number" },
                      },
                      required: ["question", "options", "correctAnswer", "explanation", "xpReward"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["title", "subtitle", "content"],
                additionalProperties: false,
              },
            },
            estimatedTime: { type: "number" },
          },
          required: ["blocks", "estimatedTime"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0]?.message?.content;
  if (!content || typeof content !== 'string') {
    throw new Error("Failed to generate mission content");
  }

  const parsedContent: GeneratedMissionContent = JSON.parse(content);
  
  // Post-process: Fix minigames with invalid structure
  parsedContent.blocks.forEach(block => {
    // Fix text-construction games
    if (block.minigame && block.minigame.type === 'text-construction') {
      if (!block.minigame.data.words || !Array.isArray(block.minigame.data.words) || block.minigame.data.words.length === 0) {
        // Extract words from question or create default
        const question = block.minigame.data.question || "How are you?";
        // Create words array from correctOrder if available, otherwise from question
        if (block.minigame.data.correctOrder && Array.isArray(block.minigame.data.correctOrder)) {
          block.minigame.data.words = [...block.minigame.data.correctOrder].sort(() => Math.random() - 0.5);
        } else {
          // Default fallback for "How are you?"
          block.minigame.data.words = ["you", "How", "?", "are"];
          block.minigame.data.correctOrder = ["How", "are", "you", "?"];
        }
      }
      // Ensure correctOrder exists
      if (!block.minigame.data.correctOrder || !Array.isArray(block.minigame.data.correctOrder)) {
        block.minigame.data.correctOrder = [...block.minigame.data.words];
      }
    }
    
    // Fix matching games
    if (block.minigame && block.minigame.type === 'matching') {
      // Check if pairs array exists and has valid structure
      if (!block.minigame.data.pairs || !Array.isArray(block.minigame.data.pairs)) {
        // Create default matching game based on greeting times
        block.minigame.data = {
          pairs: [
            { left: "Morning (6 AM - 12 PM)", right: "Good morning", correctMatch: true },
            { left: "Afternoon (12 PM - 5 PM)", right: "Good afternoon", correctMatch: true },
            { left: "Evening (5 PM - 9 PM)", right: "Good evening", correctMatch: true },
            { left: "Night (9 PM - 6 AM)", right: "Good night", correctMatch: true }
          ]
        };
      } else {
        // Validate and fix existing pairs
        block.minigame.data.pairs = block.minigame.data.pairs.map((pair: any) => {
          if (!pair.left || !pair.right) {
            return { left: "Morning", right: "Good morning", correctMatch: true };
          }
          return {
            left: String(pair.left),
            right: String(pair.right),
            correctMatch: pair.correctMatch !== undefined ? pair.correctMatch : true
          };
        });
      }
    }
  });

  return parsedContent;
}

/**
 * Generate Boss Battle content using AI
 */
export async function generateBossBattle(
  worldId: string,
  worldName: string,
  worldTheme: string,
  cefrLevel: string
): Promise<GeneratedBossBattle> {
  const systemPrompt = `You are an expert English language teacher and game designer creating an epic Boss Battle for English learning.

Context:
- World: ${worldName} (${worldTheme})
- CEFR Level: ${cefrLevel}

Create a 3-phase Boss Battle that tests all skills from this world. Each phase should have 3-4 challenges mixing different question types.

Return ONLY valid JSON in this exact format:
{
  "phases": [
    {
      "phaseNumber": 1,
      "title": "Phase Title",
      "description": "Phase description",
      "challenges": [
        {
          "type": "multiple-choice",
          "question": "Question text?",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": 0,
          "explanation": "Why this is correct"
        }
      ]
    }
  ],
  "totalXpReward": 500
}`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Generate Boss Battle for ${worldName}` },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "boss_battle",
        strict: true,
        schema: {
          type: "object",
          properties: {
            phases: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  phaseNumber: { type: "number" },
                  title: { type: "string" },
                  description: { type: "string" },
                  challenges: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string" },
                        question: { type: "string" },
                        options: { type: "array", items: { type: "string" } },
                        correctAnswer: { type: "number" },
                        explanation: { type: "string" },
                      },
                      required: ["type", "question", "correctAnswer", "explanation"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["phaseNumber", "title", "description", "challenges"],
                additionalProperties: false,
              },
            },
            totalXpReward: { type: "number" },
          },
          required: ["phases", "totalXpReward"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0]?.message?.content;
  if (!content || typeof content !== 'string') {
    throw new Error("Failed to generate boss battle");
  }

  return JSON.parse(content);
}
