# AI Agent Instructions for Test Interview Project

## Project Overview

This is a React Native quiz application built with Expo, using TypeScript. The app features authentication, quiz functionality, and user profiles.

## Architecture & Key Components

### State Management

- Uses Zustand for global state management
- Two main stores:
  - `question-store.ts`: Manages quiz state and question interactions
  - `session-store.ts`: Handles user authentication state
- Example state usage:
  ```typescript
  const sessionUserId = useSession((s) => s.userId)
  ```

### Navigation

- React Navigation with a combination of Stack and Tab navigators
- Root navigation structure:
  - Unauthenticated: Login screen
  - Authenticated: Bottom tabs (Quiz and Profile)
- Navigation is auth-protected in `root.tsx`

### Data Flow

1. Questions are fetched through API layer (`src/api/queryQuestions.ts`)
2. Question state is managed by Zustand stores
3. Components consume state through hooks and store selectors

## Component Patterns

- Question components follow a composition pattern:
  - Base `Question.tsx`
  - Specialized variants: `MultipleQuestion.tsx`, `SortQuestion.tsx`
- Common UI components in `src/components/`:
  - `Button.tsx`
  - `Input.tsx`
  - `Heading.tsx`

## Development Workflow

1. Start the development server:
   ```bash
   npm start
   ```
2. Run on specific platforms:
   ```bash
   npm run ios
   npm run android
   npm run web
   ```

## Storage & Persistence

- Uses AsyncStorage for data persistence
- Secure storage for sensitive data via Expo SecureStore
- Storage utilities centralized in `src/storage/`

## Testing & Type Safety

- TypeScript is used throughout the project
- Ensure all components and hooks are properly typed
- Follow existing type patterns in `question-store.ts`

## Integration Points

- Authentication API: `src/api/signIn.ts`, `src/api/signUp.ts`
- Question API: `src/api/queryQuestions.ts`
- Mock data handling: `src/api/mockRequest.ts`

## TODO

- Error Boundary implementation
- Sentry integration
- Accessibility improvements
- Theming system
- Localization support
