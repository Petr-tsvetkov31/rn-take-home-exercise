import { Question } from '../../api/queryQuestions'
import MultipleQuestion from './MultipleQuestion'
import SortQuestion from './SortQuestion'

type Props = {
  question: Question
}

export default function (props: Props) {
  const { question } = props

  switch (question.questionData.questionType) {
    case 'mcq':
    case 'single':
      return <MultipleQuestion />
    case 'sort':
      return <SortQuestion />
  }
}
