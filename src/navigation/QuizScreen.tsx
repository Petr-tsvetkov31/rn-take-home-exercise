import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { queryQuestions } from '../api/queryQuestions'
import Quiz from '../components/quiz/Quiz'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSession } from '../zus-store/session-store'
import { useEffect } from 'react'

export default function QuizScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['quiz'],
    queryFn: queryQuestions,
  })

  const setSessionId = useSession((s) => s.setSessionId)

  useEffect(() => {
    if (data?.sessionId) {
      setSessionId(data.sessionId)
    }
  }, [setSessionId, data?.sessionId])

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.screen}>
        {!isLoading && data?.steps ? (
          <Quiz questions={data.steps} />
        ) : (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
