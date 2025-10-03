import { Question, SortQuestionData } from '../api/queryQuestions'
import { SelectableOption } from '../components/question/MultipleQuestion'
import { create } from 'zustand'

export type Status = 'idle' | 'progress' | 'success' | 'failed'

type QuestionState = {
  question?: Question
  options?: Array<SelectableOption>
  status?: Status
  selectedCategoryIndex?: number
}

type QuestionActions = {
  setQuestion: (question: Question) => void
  onSelect: (index: number) => void
  onCheckAnswer: () => void
  onReset: () => void
  onSelectCategory: (index: number) => void
}

export type QuestionStoreState = QuestionState & QuestionActions

function mapOptions(el: { option: string }, index: number) {
  return {
    index,
    value: el.option,
    selected: false,
  }
}

function selectMultiple(
  index: number,
  options?: Array<SelectableOption>
): QuestionState {
  if (!options) return {}

  const selectedOption = options[index]
  const updatedValue = {
    ...selectedOption,
    selected: !selectedOption.selected,
  }
  const updatedOptions = options.with(index, updatedValue)
  const selected = updatedOptions.filter((el) => el.selected)
  console.log('selected', selected, updatedOptions)
  return {
    options: updatedOptions,
    status: selected.length > 0 ? 'progress' : 'idle',
  }
}

function selectSingle(
  index: number,
  options?: Array<SelectableOption>
): QuestionState {
  if (!options) return {}

  const selectedOption = options[index]
  const updatedValue = {
    ...selectedOption,
    selected: !selectedOption.selected,
  }
  const updatedOptions = options
    .map((el) => ({ ...el, selected: false }))
    .with(index, updatedValue)

  return {
    options: updatedOptions,
    status: updatedValue.selected ? 'progress' : 'idle',
  }
}

function checkMultipleAnswer(
  options?: Array<SelectableOption>,
  correctAnswers?: Array<string>
): { status: Status } {
  if (!options || !correctAnswers) return { status: 'failed' }
  const selected = options.filter((el) => el.selected).map((el) => el.value)
  const isCorrect =
    selected.length === correctAnswers.length &&
    selected.every((val) => correctAnswers.includes(val))

  return { status: isCorrect ? 'success' : 'failed' }
}

function checkSingleAnswer(
  options?: Array<SelectableOption>,
  correctAnswers?: string
): { status: Status } {
  const selected = options?.find((el) => el.selected)
  return { status: selected?.value === correctAnswers ? 'success' : 'failed' }
}

function checkSortAnswer(
  index: number,
  questionData?: SortQuestionData
): { status: Status } {
  const answer = questionData?.categories?.[index]

  if (!answer) return { status: 'failed' }

  const mapping = questionData.correct_answer_mapping?.[answer]
  const isCorrect = mapping?.[0] === questionData.options[0].option

  return { status: isCorrect ? 'success' : 'failed' }
}

export const useQuestion = create<QuestionStoreState>()((set) => ({
  question: undefined,
  options: undefined,
  status: undefined,
  selectedCategoryIndex: undefined,

  setQuestion: (question) =>
    set(() => {
      const mappedOptions = question.questionData.options.map(mapOptions)

      return {
        question,
        options: mappedOptions,
        status: 'idle',
        selectedCategoryIndex: undefined,
      }
    }),

  onSelect: (index) =>
    set(({ options, question }) =>
      question?.questionData.questionType === 'single'
        ? selectSingle(index, options)
        : selectMultiple(index, options)
    ),

  onSelectCategory: (index) =>
    set(({ question }) => {
      if (
        index === -1 ||
        question?.questionData?.questionType !== 'sort' ||
        index >= question?.questionData.categories?.length
      ) {
        return { status: 'idle' }
      }

      return { selectedCategoryIndex: index, status: 'progress' }
    }),

  onCheckAnswer: () =>
    set(({ options, selectedCategoryIndex, question }) => {
      if (!question?.questionData) return {}

      const { questionType, correctAnswers } = question.questionData

      if (questionType === 'single') {
        return checkSingleAnswer(options, correctAnswers)
      } else if (questionType === 'mcq') {
        return checkMultipleAnswer(options, correctAnswers)
      } else if (
        questionType === 'sort' &&
        selectedCategoryIndex !== undefined
      ) {
        return checkSortAnswer(selectedCategoryIndex, question?.questionData)
      }
      return {}
    }),

  onReset: () => {
    set(({ options }) => ({
      status: 'idle',
      selectedCategoryIndex: undefined,
      options: options?.map((el) => ({
        ...el,
        selected: false,
      })),
    }))
  },
}))
