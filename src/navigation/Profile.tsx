import { Button, View } from 'react-native'
import { useSession } from '../zus-store/session-store'

export default function Profile() {
  const resetSession = useSession((s) => s.resetSession)
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="logout" onPress={resetSession} />
    </View>
  )
}
