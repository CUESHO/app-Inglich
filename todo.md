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


## Mejoras Solicitadas - Iteración 2

### Visual Redesign - Neon Theme
- [x] Implement dark background with neon color scheme
- [x] Update all world colors to vibrant neon palette
- [x] Add glowing effects and cyberpunk aesthetic
- [x] Update typography for better readability on dark background

### Progression System
- [x] Implement automatic level unlocking after mission completion
- [x] Create database schema for user progress tracking
- [x] Add difficulty scaling for each subsequent level
- [ ] Increase content length and complexity per level (requires content expansion)
- [x] Add validation to ensure mastery before progression

### Localization - USA English / Mexico Spanish
- [ ] Update all English content to USA English variants
- [ ] Update all Spanish content to Mexico Spanish variants
- [ ] Review idioms, expressions, and cultural references

### Minigame Fixes
- [ ] Fix text-construction minigame with proper drag-and-drop
- [ ] Implement visual feedback for word placement
- [ ] Add validation for correct sentence structure

### Voice Pronunciation Feedback
- [ ] Add voice recording component to course pages
- [ ] Integrate real-time pronunciation analysis
- [ ] Display pronunciation feedback with visual indicators
- [ ] Add practice mode for each content block

### Pronunciation Display
- [ ] Replace IPA symbols with written phonetic pronunciation
- [ ] Use simple, readable phonetic notation (e.g., "HEH-loh" instead of /həˈloʊ/)
- [ ] Ensure visual clarity and attractiveness


## Mejoras Solicitadas - Iteración 3

### Drag-and-Drop Text Construction Minigame
- [x] Install @dnd-kit/core and @dnd-kit/sortable dependencies
- [x] Create TextConstructionGame component with drag-and-drop functionality
- [x] Implement word bank with draggable words
- [x] Implement drop zones for sentence construction
- [x] Add validation logic to check correct sentence order
- [x] Add visual feedback (correct/incorrect highlighting)
- [x] Add sound effects or animations for success/failure
- [x] Integrate component into MissionCourse.tsx
- [x] Test with various sentence structures


## Mejoras Solicitadas - Iteración 4

### Voice Practice Recorder Component
- [x] Create VoicePracticeRecorder component with MediaRecorder API
- [x] Implement audio recording functionality
- [x] Upload recorded audio to S3 using storagePut
- [x] Call pronunciation analysis tRPC procedure
- [x] Display real-time pronunciation score
- [x] Show transcription and phonetic feedback
- [x] Add visual waveform during recording
- [x] Integrate component into MissionCourse

### Database Progress Integration
- [x] Update Home.tsx to load progress from database
- [x] Implement auto-unlock of Foundation Realm on first login
- [x] Connect XP/level display to real database values
- [x] Update world unlock status from database
- [x] Save mission completion to database with XP rewards
- [x] Implement achievement tracking
- [x] Add progress persistence across sessions

### Complete Mission Content for All Worlds
- [x] Create AI-powered content generator for all missions
- [x] Implement dynamic mission content generation
- [x] Add varied minigames generation (text-construction, matching, dialogue, pronunciation)
- [x] Create dynamic Boss Battle generator
- [x] Integrate content generation into MissionCourse
- [x] Add fallback to static content if generation fails


## Mejoras Solicitadas - Iteración 5

### Visual Rewards System
- [x] Create RewardAnimation component with confetti effects
- [x] Add particle effects for XP gains
- [x] Implement level-up celebration animation
- [x] Add world unlock celebration animation
- [x] Integrate sound effects for rewards
- [x] Add visual feedback for coin collection
- [x] Create achievement unlock animation

### Virtual Shop (Power-ups Store)
- [x] Design shop UI with neon theme
- [x] Create shop database schema for items and purchases
- [x] Implement hint power-up (costs coins)
- [x] Implement XP multiplier power-up (temporary boost)
- [x] Create avatar customization system
- [x] Add early world unlock option
- [x] Implement purchase confirmation dialogs
- [x] Add transaction history
- [x] Create shop navigation in main menu

### Daily Streak System
- [x] Create streak database schema
- [x] Implement daily check-in logic
- [x] Create streak counter UI component
- [x] Add incremental rewards for consecutive days
- [x] Implement streak freeze power-up
- [x] Add streak milestone celebrations
- [ ] Integrate push notifications for reminders (requires notification API setup)
- [x] Create streak recovery system (grace period)
- [ ] Add streak leaderboard (future enhancement)


## Bug Fixes - Iteración 6

### MinigameRenderer Error Fix
- [x] Identify the source of "Cannot read properties of undefined (reading 'map')" error
- [x] Add proper validation for minigame data in MissionCourse.tsx
- [x] Add fallback UI for missing or invalid minigame data
- [x] Test all minigame types to ensure they load correctly


## Bug Fixes - Iteración 7

### VoicePracticeRecorder Error Fix
- [x] Identify the source of "Cannot read properties of undefined (reading 'split')" error
- [x] Add proper validation for targetPhrase prop in VoicePracticeRecorder
- [x] Add fallback handling for undefined or null values
- [x] Test pronunciation practice functionality


## Bug Fixes - Iteración 8

### Matching Game Data Structure Fix
- [x] Identify the correct structure for matching game data
- [x] Update contentGenerator.ts to generate valid matching game structure
- [x] Update validation in MissionCourse.tsx for matching games
- [x] Test matching games to ensure they work correctly


## Mejoras Solicitadas - Iteración 9

### Block Completion Checklist & Validation System
- [x] Create visual checklist component that appears when user completes a block
- [x] Track quiz answers and calculate percentage of correct responses
- [x] Implement 70% threshold validation for block completion
- [x] Block access to next block if user doesn't achieve 70% correct answers
- [x] Allow retry of current block until 70% threshold is met
- [x] Unlock next mission only when current mission blocks are completed with +70%
- [x] Show progress feedback (e.g., "8/10 correct - 80% - Block Unlocked!")
- [x] Add visual indicators for locked/unlocked blocks based on performance
- [x] Track minigame completion in addition to quiz answers
- [x] Include minigames in total activity count for percentage calculation
- [x] Call onComplete callback for all minigame types (matching, text-construction, dialogue-choice, pronunciation-practice)

### Auto-Hide Navigation Panel
- [x] Implement scroll detection in MissionCourse component
- [x] Hide "Back to Missions" button when user scrolls down
- [x] Show "Back to Missions" button when user scrolls up
- [x] Add smooth transition animations for show/hide
- [x] Ensure button remains accessible on mobile devices
