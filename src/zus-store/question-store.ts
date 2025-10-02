import { createJSONStorage, persist } from 'zustand/middleware'
import { Question } from '../api/queryQuestions'
import { SelectableOption } from '../components/question/MultipleQuestion'
import { createStore } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'

type Status = 'idle' | 'progress' | 'success' | 'failed'

type QuestionState = {
  options: Array<SelectableOption>
  status: Status
  selectedCategoryIndex?: number
}

type QuestionActions = {
  onSelect: (index: number) => void
  onCheckAnswer: () => void
  onReset: () => void
  onSelectCategory: (index: number) => void
}

export type QuestionStoreState = QuestionState & QuestionActions

function mapOptions(el: { option: string }, index: number) {
  console.log(el)
  return {
    index,
    value: el.option,
    selected: false,
  }
}

function selectMultiple(
  index: number,
  options: Array<SelectableOption>
): QuestionState {
  const selectedOption = options[index]
  const updatedValue = {
    ...selectedOption,
    selected: !selectedOption.selected,
  }
  const updatedOptions = options.with(index, updatedValue)
  const selected = updatedOptions.filter((el) => el.selected)

  return {
    options: updatedOptions,
    status: selected.length > 0 ? 'progress' : 'idle',
  }
}

function selectSingle(
  index: number,
  options: Array<SelectableOption>
): QuestionState {
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
  options: Array<SelectableOption>,
  correctAnswers: Array<string>
): 'success' | 'failed' {
  const selected = options.filter((el) => el.selected).map((el) => el.value)
  const isCorrect =
    selected.length === correctAnswers.length &&
    selected.every((val) => correctAnswers.includes(val))

  return isCorrect ? 'success' : 'failed'
}

function checkSingleAnswer(
  options: Array<SelectableOption>,
  correctAnswer: string
): { status: Status } {
  const selected = options.find((el) => el.selected)
  return { status: selected?.value === correctAnswer ? 'success' : 'failed' }
}

function checkSortAnswer(
  index: number,
  question: Question
): { status: Status } {
  const answer = question.questionData.categories?.[index]

  if (!answer) return { status: 'failed' }

  const mapping = question.questionData.correct_answer_mapping?.[answer]
  const isCorrect = mapping?.[0] === question.questionData.options[0].option

  return { status: isCorrect ? 'success' : 'failed' }
}

export const createQuestionStore = (question: Question) => {
  const {
    questionData: { options: initOptions, correctAnswer, questionType },
  } = question
  const mappedOptions = initOptions.map(mapOptions)

  return createStore<QuestionStoreState>()(
    persist(
      (set, _, store) => ({
        options: mappedOptions,
        status: 'idle',
        selectedCategoryIndex: undefined,

        onSelect: (index) => set(({ options }) => selectSingle(index, options)),
        onSelectCategory: (index) =>
          set(() => {
            if (
              index === -1 ||
              index >= question.questionData.categories?.length
            )
              return { status: 'idle' }
            return { selectedCategoryIndex: index, status: 'progress' }
          }),

        onCheckAnswer: () =>
          set(({ options, selectedCategoryIndex }) => {
            console.log('check', { questionType, selectedCategoryIndex })
            if (questionType === 'mcq') {
              return checkSingleAnswer(options, correctAnswer)
            } else if (
              questionType === 'sort' &&
              selectedCategoryIndex !== undefined
            ) {
              return checkSortAnswer(selectedCategoryIndex, question)
            }
            return {}
          }),
        onReset: () => {
          set(store.getInitialState())
        },
      }),
      {
        name: 'question-storage',
        storage: createJSONStorage(() => AsyncStorage),
        // merge: (persisted, current) => {
        //   console.log('merge: ', persisted, current)
        //   return { ...persisted, ...current }
        // },
        // partialize: (state) => ({
        //   status: state.status,
        //   options: state.options,
        // }),
        skipHydration: true,
      }
    )
  )
}

export type QuestionStore = ReturnType<typeof createQuestionStore>
