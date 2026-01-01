# Inglich 1, 2 x 3 - Project TODO

## Core Features

### Phase 1: Data Structure & Configuration
- [x] Define 8 worlds data structure with names, emojis, colors, descriptions
- [x] Define 10 missions per world with objectives, dynamics, difficulty
- [x] Create course-game content structure for each mission
- [x] Set up database schema for user progress, XP, achievements

### Phase 2: Main Page & World Selection
- [x] Design and implement main landing page
- [x] Create world selector with 8 gamified thematic worlds
- [x] Display world cards with emoji, color, narrative description
- [x] Add world unlock/lock system based on user progress
- [x] Implement responsive layout for world grid

### Phase 3: Mission Selection System
- [x] Create mission selection page for each world
- [x] Display 10 playable missions per world
- [x] Show mission objectives, dynamics, and difficulty stars
- [x] Add mission progress indicators
- [x] Implement back navigation to world selector

### Phase 4: Course-Game Generator
- [x] Build course-game layout with thematic blocks
- [x] Implement tabbed/section navigation within course
- [x] Create minigame components: drag-and-drop puzzles
- [x] Create minigame components: multiple choice dialogues
- [x] Create minigame components: text construction challenges
- [x] Create minigame components: interactive decisions
- [x] Add practical explanations and visual content for each block
- [x] Implement course navigation (next/previous block)

### Phase 5: Quiz System & Boss Battle
- [x] Create quiz component with multiple choice questions
- [x] Implement immediate feedback with error explanations
- [x] Build Boss Battle component with multiple phases
- [x] Add XP reward system for completed activities
- [x] Create progress bar and level display
- [x] Implement achievement/medal unlocking system
- [x] Add virtual coins system
- [x] Create leaderboard component

### Phase 6: Advanced Features
- [x] Integrate AI tutor for personalized explanations
- [x] Implement AI-generated contextual feedback based on user errors
- [x] Add voice recognition for pronunciation practice
- [x] Create pronunciation comparison with native models
- [x] Implement feedback on phonemes, rhythm, intonation
- [x] Generate custom illustrations for thematic blocks
- [x] Create world-specific artwork based on narrative

### Phase 7: Bilingual Translation & Polish
- [x] Add English/Spanish translation toggle button
- [x] Implement translation for all content sections
- [x] Ensure motivational tone with game metaphors
- [x] Add emojis throughout the interface
- [x] Polish UI/UX with animations and transitions
- [x] Test all features and fix bugs

### Phase 8: Testing & Deployment
- [x] Write vitest tests for core functionality
- [x] Test user flow from world selection to course completion
- [x] Create checkpoint for deployment

## Technical Implementation Notes

- Use tRPC for all backend procedures
- Store user progress, XP, achievements in database
- Use LLM integration for AI tutor functionality
- Implement voice transcription for pronunciation practice
- Use image generation API for custom illustrations
- Ensure all content is in English with Spanish translation option
- Follow CEFR levels (A1-C2) for curriculum structure

## Design Requirements

- Gamified video game aesthetic
- Distinctive colors per world
- Immersive narrative elements
- Motivational tone with game metaphors
- Emoji usage throughout
- Responsive design for all devices
