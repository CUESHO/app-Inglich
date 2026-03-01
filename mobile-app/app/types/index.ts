export interface User {
  id: string;
  email: string;
  name: string;
  level: number;
  xp: number;
  coins: number;
  createdAt: Date;
}

export interface World {
  id: number;
  name: string;
  description: string;
  missions: Mission[];
  unlockedAt?: number;
}

export interface Mission {
  id: number;
  worldId: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  coinsReward: number;
  completed?: boolean;
}

export interface Lesson {
  id: number;
  missionId: number;
  title: string;
  content: string;
  type: 'vocabulary' | 'grammar' | 'listening' | 'speaking';
}

export interface Question {
  id: number;
  lessonId: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface UserProgress {
  userId: string;
  worldId: number;
  missionId: number;
  lessonsCompleted: number;
  questionsAnswered: number;
  correctAnswers: number;
  lastAccessedAt: Date;
}
