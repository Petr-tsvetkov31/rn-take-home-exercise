import { create } from 'zustand'
import { createSelectors } from './utils'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

type SessionState = {
  userId?: string
  email?: string
  sessionId?: string
  currentQuestionIndex: number
  totalSessions: number
  correctAnswers: number
  timeSpentPerQuestion: Array<number>
  questionStreak: number
  currentStreak: number
  accuracyPercentage: number
}

type SessionActions = {
  setSession: (input: Partial<SessionState>) => void
  incrementQuestionIndex: () => void
  resetSession: () => void
  setSessionId: (sessionId: string) => void
  incrementCorrectAnswers: () => void
  addTimeSpentForQuestion: (time: number) => void
  updateStreak: (isCorrect: boolean) => void
  updateAccuracy: () => void
}

type SessionStore = SessionState & SessionActions

const default_session: SessionState = {
  userId: undefined,
  email: undefined,
  sessionId: undefined,
  currentQuestionIndex: 0,
  totalSessions: 0,
  correctAnswers: 0,
  timeSpentPerQuestion: [],
  questionStreak: 0,
  currentStreak: 0,
  accuracyPercentage: 0,
}

const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      ...default_session,

      setSessionId: (sessionId) => set(() => ({ sessionId })),

      incrementCorrectAnswers: () =>
        set(({ correctAnswers }) => ({
          correctAnswers: correctAnswers + 1,
        })),

      addTimeSpentForQuestion: (time) =>
        set(({ timeSpentPerQuestion }) => ({
          timeSpentPerQuestion: [...timeSpentPerQuestion, time],
        })),

      updateStreak: (isCorrect) =>
        set(({ currentStreak, questionStreak }) => {
          const newCurrentStreak = isCorrect ? currentStreak + 1 : 0
          return {
            currentStreak: newCurrentStreak,
            questionStreak: Math.max(questionStreak, newCurrentStreak),
          }
        }),

      updateAccuracy: () =>
        set(({ correctAnswers, currentQuestionIndex }) => {
          const accuracy =
            currentQuestionIndex === 0
              ? 0
              : (correctAnswers / currentQuestionIndex) * 100
          return { accuracyPercentage: Math.round(accuracy) }
        }),

      setSession: (newState) =>
        set((state) => {
          return { ...state, ...newState }
        }),

      incrementQuestionIndex: () =>
        set(({ currentQuestionIndex }) => ({
          currentQuestionIndex: currentQuestionIndex + 1,
        })),

      resetSession: () => set(() => ({ ...default_session })),
    }),
    {
      name: 'session-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

export const useSession = createSelectors(useSessionStore)
