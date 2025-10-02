import { StyleSheet, Text, View } from 'react-native'
import { Question as QuestionType } from '../../api/queryQuestions'
import SubmitSection from '../submit/SubmitSection'
import Question from '../question/Question'
import Heading from '../heading/Heading'
import { useSession } from '../../zus-store/session-store'
import { useMutation } from '@tanstack/react-query'
import { Status, useQuestionV2 } from '../../zus-store/question-store-v2'
import { useEffect } from 'react'
import Progress from '../progress/Progress'

type Props = {
  questions: Array<QuestionType>
}

export default function Quiz(props: Props) {
  const { questions } = props
  const currentQuestionIndex = useSession((s) => s.currentQuestionIndex)
  const incrementQuestionIndex = useSession((s) => s.incrementQuestionIndex)
  const sessionId = useSession((s) => s.sessionId)

  const currentQuestion = questions[currentQuestionIndex]

  const { mutate: submitAnswer } = useMutation({
    mutationFn: (data: any) => {
      // API call to submit the answer
      console.log('Submitting answer data:', data)
      return Promise.resolve() // Simulate successful submission
    },
  })

  const setQuestion = useQuestionV2((s) => s.setQuestion)

  useEffect(() => {
    setQuestion(currentQuestion)
  }, [currentQuestion, setQuestion])

  const onSubmit = () => {
    submitAnswer({
      sessionId,
      totalQuestions: questions.length,
      correctAnswers: [],
      // timeSpentPerQuestion: number[], // seconds per question
      // questionStreak: number, // max consecutive correct in this session
      // completedAt: string
    })
    incrementQuestionIndex()
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <View style={styles.quizContainer}>
      <View style={styles.questionContainer}>
        <View style={styles.progressContainer}>
          <Progress percentage={progress} />
          <Text style={styles.progressText}>{`${currentQuestionIndex + 1}/${
            questions.length
          }`}</Text>
        </View>

        <Text style={styles.questionTypeText}>
          {currentQuestion.questionData.questionType === 'mcq'
            ? 'Choose the correct answer'
            : 'Drag into the correct category'}
        </Text>

        <Heading heading={currentQuestion.heading} />

        <Question key={currentQuestion.index} question={currentQuestion} />
      </View>

      <SubmitSection onSubmit={onSubmit} />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  quizContainer: {
    flex: 1,
    width: '100%',
  },
  questionContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  progressText: {
    color: '#05B0FF',
  },
  questionTypeText: {
    color: '#05B0FF',
    fontSize: 17,
    fontWeight: '500',
    paddingBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
})
