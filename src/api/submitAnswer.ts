type SubmitAnswerInput = {
  sessionId: string
  totalQuestions: number
  correctAnswers: number
  timeSpentPerQuestion: number[] // seconds per question
  questionStreak: number // max consecutive correct in this session
  completedAt: string
}

export function submitAnswer(input: SubmitAnswerInput) {
  // Simulate an API call to submit the answer
  return new Promise((resolve) => {
    console.log('Answer submitted:', input)
    setTimeout(resolve, 1000) // Simulate network delay
  })
}
