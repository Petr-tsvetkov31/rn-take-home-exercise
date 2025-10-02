import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import Input from '../components/input/Input'
import { useRef, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import Button from '../components/button/Button'
import { useSession } from '../zus-store/session-store'

export default function Login() {
  const passwordInputRef = useRef<typeof TextInput>(null)
  const { bottom } = useSafeAreaInsets()
  const setSessionState = useSession((s) => s.setSession)

  const [email, setEmail] = useState<string | undefined>()
  const [password, setPassword] = useState<string | undefined>()

  const onEmailChange = (text: string) => {
    setEmail(text)
  }

  const onPassword = (text: string) => {
    setPassword(text)
  }

  const login = () => {
    setSessionState({
      email,
      userId: 'ID',
      totalSessions: 10,
      currentStreak: 2,
      accuracyPercentage: 30,
    })
  }

  const disabled = !(email?.length && password?.length)
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <KeyboardAvoidingView
          style={styles.content}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.inputsContainer}>
            <Input
              value={email}
              onChange={onEmailChange}
              placeholder="email"
              onSubmitEditing={() => {
                passwordInputRef.current?.focus()
              }}
            />
            <Input
              ref={passwordInputRef}
              value={password}
              onChange={onPassword}
              placeholder="password"
              secureTextEntry
            />
          </View>

          <View style={{ marginBottom: bottom + 30 }}>
            <Button title="Login" onPress={login} disabled={disabled} />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  inputsContainer: {
    flex: 1,
    width: '100%',
  },
})
