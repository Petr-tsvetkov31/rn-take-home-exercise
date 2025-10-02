# Interactive Quiz App

A React Native quiz application with interactive drag-and-drop questions, authentication, and profile management.

## Project Setup

1. **Prerequisites**

   - Node.js (v20.5.0 or higher)
   - npm/yarn
   - Expo CLI: `npm install -g expo-cli`

2. **Installation**

   ```bash
   # Clone the repository
   git clone [repository-url]
   cd test-interview

   # Install dependencies
   npm install

   # Start the development server
   npm start
   ```

3. **Running on Different Platforms**

   ```bash
   # iOS
   npm run ios

   # Android
   npm run android

   # Web
   npm run web
   ```

## Tech Stack & Tooling

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**:
  - Zustand for global state
  - React Query for API data fetching
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **Storage**:
  - AsyncStorage for general persistence
  - Expo SecureStore for sensitive data
- **Animations**: React Native Reanimated
- **Gestures**: React Native Gesture Handler

## Project Structure

```
src/
├── api/                 # API integration layer
│   ├── mockRequest.ts
│   ├── queryQuestions.ts
│   ├── signIn.ts
│   └── signUp.ts
├── components/          # Reusable UI components
│   ├── button/
│   ├── heading/
│   ├── input/
│   ├── question/       # Question-specific components
│   └── quiz/
├── hooks/              # Custom hooks
├── navigation/         # Navigation setup and screens
├── storage/           # Storage utilities
└── zus-store/         # Global state management
```

### Key Features

- Authentication flow with protected routes
- Interactive quiz questions with drag-and-drop
- Profile management
- Persistent storage
- Type-safe state management

## Development Patterns

1. **State Management**

   - Use Zustand stores for global state
   - Keep state minimal and focused
   - Example: `useQuestionV2((s) => s.question)`

2. **Component Structure**

   - Base components in `components/`
   - Feature-specific components co-located with features
   - Composition over inheritance

3. **Type Safety**
   - Strict TypeScript usage
   - Props interfaces for all components
   - Type guards for API responses

## TODO

### High Priority

- [ ] Add token expiration logic
- [ ] Handle network errors and Connectivity problems
- [ ] Implement ErrorBoundary for graceful error handling
- [ ] Integrate Sentry for error tracking
- [ ] Add proper loading states for API calls

### Enhancement

- [ ] Improve accessibility features
- [ ] Implement theming system
- [ ] Add localization support
- [ ] Add unit tests
- [ ] Add E2E tests with Maestro or Detox

### Documentation

- [ ] Create component storybook
- [ ] Add API documentation

## Contributing

1. Branch naming: `feature/`, `bugfix/`, `hotfix/`
2. Commit messages: follow conventional commits
3. PR process: link issues, add tests, update docs
