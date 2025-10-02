import { Question } from '../api/queryQuestions'

type Answer = {
  answer?: string
  answerMapping?: Record<string, Array<string>>
}

export function checkQuestionAnswer(
  question: Question,
  answer: Answer
): boolean {
  if (question.questionData.questionType === 'mcq') {
    return question.questionData.correctAnswer === answer.answer
  }

  return false
}

// export function useMarking(question: Question, answer: Answer): boolean {
//   if ()
// }
