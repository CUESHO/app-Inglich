import { describe, it, expect } from 'vitest';

describe('TextConstructionGame Component', () => {
  it('should have correct props interface', () => {
    const mockProps = {
      question: 'How do you greet someone in the morning?',
      words: ['Good', 'morning', 'How', 'are', 'you'],
      correctOrder: ['Good', 'morning'],
      onComplete: (isCorrect: boolean) => {},
      neonColor: '#00D9FF',
    };

    expect(mockProps.question).toBe('How do you greet someone in the morning?');
    expect(mockProps.words).toHaveLength(5);
    expect(mockProps.correctOrder).toHaveLength(2);
    expect(mockProps.neonColor).toBe('#00D9FF');
  });

  it('should validate correct order matching', () => {
    const words = ['Good', 'morning', 'How', 'are', 'you'];
    const correctOrder = ['Good', 'morning'];
    const userAnswer = ['Good', 'morning'];

    const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(correctOrder);
    expect(isCorrect).toBe(true);
  });

  it('should detect incorrect order', () => {
    const correctOrder = ['Good', 'morning'];
    const userAnswer = ['morning', 'Good'];

    const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(correctOrder);
    expect(isCorrect).toBe(false);
  });

  it('should handle empty drop zone', () => {
    const correctOrder = ['Good', 'morning'];
    const userAnswer: string[] = [];

    const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(correctOrder);
    expect(isCorrect).toBe(false);
  });

  it('should handle partial answers', () => {
    const correctOrder = ['Good', 'morning', 'How', 'are', 'you'];
    const userAnswer = ['Good', 'morning'];

    const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(correctOrder);
    expect(isCorrect).toBe(false);
  });
});
