export type MinigameType = 
  | "drag-drop"
  | "multiple-choice"
  | "text-construction"
  | "dialogue-choice"
  | "matching"
  | "fill-blank";

export type Minigame = {
  id: string;
  type: MinigameType;
  title: string;
  instructions: string;
  data: any; // Specific data structure per minigame type
  correctAnswer: any;
  xpReward: number;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation: string;
  xpReward: number;
};

export type ContentBlock = {
  id: string;
  title: string;
  subtitle?: string;
  content: string; // Markdown or HTML content
  imageUrl?: string;
  imageSuggestion?: string;
  minigame?: Minigame;
  quiz?: QuizQuestion[];
};

export type BossBattlePhase = {
  id: string;
  phaseNumber: number;
  title: string;
  description: string;
  challenge: QuizQuestion;
  xpReward: number;
  timeLimit?: number; // in seconds
};

export type BossBattle = {
  id: string;
  title: string;
  description: string;
  phases: BossBattlePhase[];
  totalXpReward: number;
};

export type CourseGame = {
  id: string;
  missionId: string;
  title: string;
  description: string;
  estimatedTime: number; // in minutes
  blocks: ContentBlock[];
  bossBattle?: BossBattle;
};

// Sample course content for "Greetings Quest" (foundation-1)
export const SAMPLE_COURSE_GREETINGS: CourseGame = {
  id: "course-foundation-1",
  missionId: "foundation-1",
  title: "Greetings Quest - Master the Art of Hello",
  description: "Learn the ancient greetings of the English Kingdom and become a master of first impressions!",
  estimatedTime: 45,
  blocks: [
    {
      id: "block-1",
      title: "Welcome to the Realm",
      subtitle: "The Ancient Greetings of the Kingdom",
      content: `
# The Ancient Greetings of the Kingdom 🏰

In the Foundation Realm, every adventure begins with a greeting. Warriors, wizards, and adventurers meet each day and greet each other with respect and warmth. Today, you will learn the most ancient and powerful greetings in English.

## Basic Greetings 👋

| Expression | Pronunciation | Meaning | Context |
|-----------|---------------|---------|---------|
| **Hello** | /həˈloʊ/ | Hola | Formal & Informal |
| **Hi** | /haɪ/ | Hola | Informal |
| **Good morning** | /ɡʊd ˈmɔːrnɪŋ/ | Buenos días | Formal |
| **Good afternoon** | /ɡʊd ˌæftərˈnuːn/ | Buenas tardes | Formal |
| **Good evening** | /ɡʊd ˈiːvnɪŋ/ | Buenas noches | Formal |
| **Hey** | /heɪ/ | ¡Oye! | Very Informal |

## How to Respond 💬

When someone greets you, you must respond. Here are the most common responses:

- **Hello!** → **Hello!** / **Hi!**
- **How are you?** → **I'm fine, thanks!** / **I'm good!** / **Great!**
- **What's your name?** → **My name is [Name].** / **I'm [Name].**

Remember: In English-speaking cultures, greetings are important! Always respond with a smile 😊
      `,
      imageSuggestion: "Illustration of castle characters greeting each other with different gestures",
      minigame: {
        id: "minigame-1-1",
        type: "matching",
        title: "Greeting Matcher",
        instructions: "Match each greeting with its correct response!",
        data: {
          pairs: [
            { left: "Hello", right: "Hello!" },
            { left: "How are you?", right: "I'm fine, thanks!" },
            { left: "What's your name?", right: "My name is Alex" },
            { left: "Good morning", right: "Good morning!" },
          ],
        },
        correctAnswer: null,
        xpReward: 50,
      },
    },
    {
      id: "block-2",
      title: "Personal Introduction Formula",
      subtitle: "The Sacred Introduction Ritual",
      content: `
# The Sacred Introduction Ritual 📝

To be a true adventurer, you must know how to introduce yourself. The formula is simple but powerful:

## The Magic Structure 🪄

\`\`\`
1. Greeting: "Hello" / "Hi"
2. Name Introduction: "My name is [Name]" / "I'm [Name]"
3. Pleasure Statement: "Nice to meet you!" / "Pleased to meet you!"
\`\`\`

## Complete Example:

**Person A:** "Hello! My name is Sarah. Nice to meet you!"  
**Person B:** "Hi! I'm Tom. Pleased to meet you too!"

## Formality Levels

| Very Formal | Formal | Informal | Very Informal |
|------------|--------|----------|--------------|
| Good morning. My name is Dr. Johnson. It is a pleasure to make your acquaintance. | Hello. I'm Sarah. Nice to meet you. | Hi! I'm Tom. Nice to meet you! | Hey! I'm Alex. What's up? |

**Pro Tip:** Match your formality level to the situation! Job interview = Very Formal. Meeting friends = Informal.
      `,
      imageSuggestion: "Two castle characters exchanging magical introduction cards",
      minigame: {
        id: "minigame-1-2",
        type: "text-construction",
        title: "Build Your Introduction",
        instructions: "Arrange the words to create a correct introduction!",
        data: {
          words: ["you", "meet", "to", "Hi", "I'm", "nice", "Alex", "!"],
          correctOrder: ["Hi", "!", "I'm", "Alex", ".", "nice", "to", "meet", "you", "!"],
        },
        correctAnswer: "Hi! I'm Alex. Nice to meet you!",
        xpReward: 75,
      },
    },
    {
      id: "block-3",
      title: "Common Questions & Responses",
      subtitle: "Questions the Kingdom Will Ask You",
      content: `
# Questions the Kingdom Will Ask You ❓

When you introduce yourself, people always ask questions. Here are the most common ones:

## Frequent Questions 🤔

| Question | Response | Variation |
|----------|----------|-----------|
| **What's your name?** | My name is [Name]. / I'm [Name]. | Who are you? |
| **Where are you from?** | I'm from [Country/City]. | Where do you come from? |
| **How are you?** | I'm fine, thanks! / I'm good! | How are you doing? |
| **What do you do?** | I'm a [profession]. / I'm a student. | What's your job? |
| **Nice to meet you!** | Nice to meet you too! / Likewise! | Pleasure to meet you! |

## Pronunciation Tips 🎤

- **What's** = /wɑːts/ (contraction of "What is")
- **Where** = /wer/ (doesn't sound like "wear")
- **You** = /juː/ (more like "yoo")

**Important:** In English, we use contractions (What's, I'm, You're) in informal speech. They make you sound more natural!
      `,
      imageSuggestion: "Character answering questions in an interview setting",
      quiz: [
        {
          id: "quiz-1-1",
          question: "What is the most formal way to greet someone?",
          options: ["Hey!", "Good morning", "What's up?", "Hi there!"],
          correctAnswer: 1,
          explanation: "Good morning is the most formal greeting among these options. It's perfect for professional settings.",
          xpReward: 25,
        },
        {
          id: "quiz-1-2",
          question: "How do you respond to 'What's your name?'?",
          options: ["Nice to meet you!", "My name is [Name].", "How are you?", "I'm fine, thanks!"],
          correctAnswer: 1,
          explanation: "My name is [Name] directly answers the question about your name.",
          xpReward: 25,
        },
        {
          id: "quiz-1-3",
          question: "Which is an informal variation of 'Hello'?",
          options: ["Good evening", "Pleased to meet you", "Hey", "Good morning"],
          correctAnswer: 2,
          explanation: "Hey is a very informal greeting used with friends and casual situations.",
          xpReward: 25,
        },
      ],
    },
    {
      id: "block-4",
      title: "Cultural Context",
      subtitle: "Greetings Around the World",
      content: `
# Greetings Across the English Kingdoms 🌍

English is spoken in many places. Greetings can vary by culture and country.

## Regional Variations 🗺️

| Country/Region | Common Greeting | Context |
|----------------|-----------------|---------|
| **USA** | "Hey! What's up?" | Very informal |
| **UK** | "Alright, mate?" | Informal, friendly |
| **Australia** | "G'day!" | Very casual |
| **Canada** | "How's it going?" | Informal |
| **Ireland** | "How are ya?" | Friendly |

## Formality Matters 🎩

In formal contexts (job interviews, first professional meetings), always use:
- "Hello" instead of "Hi"
- "Pleased to meet you" instead of "Nice to meet you"
- "Good morning/afternoon/evening" instead of "Hey"

**Cultural Note:** In English-speaking countries, people often greet strangers with a smile and "Hello!" This is considered polite and friendly, not strange! 😊
      `,
      imageSuggestion: "Interactive world map with characters from different countries",
      minigame: {
        id: "minigame-1-3",
        type: "dialogue-choice",
        title: "Question-Response Dialogue",
        instructions: "A castle character greets you. How do you respond?",
        data: {
          scenario: "A knight approaches you at the castle gates.",
          dialogue: "Hello! What's your name?",
          options: [
            "My name is Emma. Nice to meet you!",
            "I'm Emma. What's your name?",
            "Emma is my name. I'm from here.",
            "Nice to meet you too!",
          ],
          correctAnswers: [0, 1], // Both A and B are correct
          feedback: {
            0: "Perfect! You introduced yourself clearly and politely.",
            1: "Great! You also asked their name back, showing interest.",
            2: "Good, but the structure is a bit awkward. Option A or B is more natural.",
            3: "This doesn't answer their question. Always respond to what they asked!",
          },
        },
        correctAnswer: [0, 1],
        xpReward: 100,
      },
    },
  ],
  bossBattle: {
    id: "boss-foundation-1",
    title: "The Guardian of Greetings",
    description: "Face the Guardian of the Castle and prove your mastery of greetings!",
    totalXpReward: 600,
    phases: [
      {
        id: "phase-1",
        phaseNumber: 1,
        title: "Initial Greeting",
        description: "The Guardian welcomes you. Respond appropriately!",
        challenge: {
          id: "boss-q-1",
          question: "GUARDIAN: 'Hail, traveler! Welcome to our realm.' - How do you respond?",
          options: [
            "Hello! Thank you for welcoming me.",
            "Hi! I'm happy to be here.",
            "Good morning! It's an honor.",
            "All of the above are correct.",
          ],
          correctAnswer: 3,
          explanation: "All responses are appropriate and polite greetings in this context!",
          xpReward: 100,
        },
        xpReward: 100,
        timeLimit: 30,
      },
      {
        id: "phase-2",
        phaseNumber: 2,
        title: "Introduction Challenge",
        description: "The Guardian asks your name. Introduce yourself completely!",
        challenge: {
          id: "boss-q-2",
          question: "GUARDIAN: 'What is your name, brave one?' - What do you say?",
          options: [
            "My name is [Your Name]. Nice to meet you!",
            "I'm [Your Name].",
            "You can call me [Your Name].",
            "All of the above are correct.",
          ],
          correctAnswer: 3,
          explanation: "All of these are valid ways to introduce yourself!",
          xpReward: 100,
        },
        xpReward: 100,
        timeLimit: 30,
      },
      {
        id: "phase-3",
        phaseNumber: 3,
        title: "Dialogue Challenge",
        description: "The Guardian asks about your journey. Answer with complete sentences!",
        challenge: {
          id: "boss-q-3",
          question: "GUARDIAN: 'Where are you from, and what brings you to our kingdom?' - Respond:",
          options: [
            "I'm from [Country]. I came here to learn English.",
            "I'm from [Country]. I want to master the language.",
            "I'm from [Country]. I'm on a quest for knowledge.",
            "All of the above are correct.",
          ],
          correctAnswer: 3,
          explanation: "All responses answer both parts of the question correctly!",
          xpReward: 150,
        },
        xpReward: 150,
        timeLimit: 60,
      },
      {
        id: "phase-4",
        phaseNumber: 4,
        title: "Final Question",
        description: "The Guardian tests your emotional expression!",
        challenge: {
          id: "boss-q-4",
          question: "GUARDIAN: 'How are you feeling about your journey?' - Express yourself:",
          options: [
            "I'm excited! I'm ready to learn and grow.",
            "I'm nervous, but I'm determined to succeed.",
            "I'm confident! I will master this language.",
            "All of the above are correct.",
          ],
          correctAnswer: 3,
          explanation: "All responses show emotional expression with proper structure!",
          xpReward: 150,
        },
        xpReward: 150,
        timeLimit: 30,
      },
    ],
  },
};

// Helper function to get course content by mission ID
export function getCourseByMissionId(missionId: string): CourseGame | undefined {
  // For now, only return sample course for foundation-1
  if (missionId === "foundation-1") {
    return SAMPLE_COURSE_GREETINGS;
  }
  return undefined;
}
