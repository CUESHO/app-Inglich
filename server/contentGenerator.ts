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
- text-construction: { question, words: string[], correctOrder: string[] }
- matching: { pairs: [{ left, right }] }
- dialogue-choice: { scenario, dialogue, options: string[], correctAnswers: number[], feedback: string[] }
- pronunciation-practice: { targetPhrase, missionId }`;

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

  return JSON.parse(content);
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
