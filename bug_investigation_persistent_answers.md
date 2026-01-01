# Bug Investigation: Persistent Quiz Answers Across Blocks

## Problem Description
When navigating from Block 1 to Block 2, quiz answers from previous interactions persist:
- Quiz shows "Question 2 / 3" instead of "Question 1 / 3"
- Option C is already selected (gray background)
- User cannot start fresh on Block 2

## Root Cause Hypothesis
The quiz state (currentQuestionIndex, quizAnswers, selectedAnswer) is stored in React component state but NOT being reset when:
1. User navigates to a new block (currentBlockIndex changes)
2. User returns to a previously completed block

## Expected Behavior
- Each block should start with a clean slate
- Quiz should show "Question 1 / X"
- No answers should be pre-selected
- Minigame state should be reset

## Code Locations to Check
1. `client/src/pages/MissionCourse.tsx` - Quiz state management
2. Look for `useState` declarations for quiz-related state
3. Check `useEffect` hooks that should trigger on `currentBlockIndex` change
4. Verify if state is being persisted in localStorage

## Solution Strategy
Add a `useEffect` hook that resets quiz/minigame state whenever `currentBlockIndex` changes:
```typescript
useEffect(() => {
  // Reset quiz state
  setCurrentQuestionIndex(0);
  setQuizAnswers([]);
  setSelectedAnswer(null);
  // Reset minigame state
  // ... etc
}, [currentBlockIndex]);
```
