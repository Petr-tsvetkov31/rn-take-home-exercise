import { mockRequest } from './mockRequest'
import data from '../../data.json'

export type SortQuestionData = {
  questionType: 'sort'
  options: Array<{
    option: string
  }>
  correctAnswer: string
  categories: Array<string>
  correct_answer_mapping: Record<string, Array<string>>
}

export type MultipleQuestionData = {
  questionType: 'mcq'
  options: Array<{
    option: string
  }>
  correctAnswer: string
  categories: null
  correct_answer_mapping: null
}

export type QuestionData = MultipleQuestionData | SortQuestionData

export type Question = {
  index: number
  title: string
  heading: string
  description: string
  questionData: QuestionData
}

export type QuestionsResponse = {
  sessionId: string
  steps: Array<Question>
}

export function queryQuestions(): Promise<QuestionsResponse> {
  const response: QuestionsResponse = {
    sessionId: 'id',
    steps: data.steps as Array<Question>,
  }

  return mockRequest(response)
}
