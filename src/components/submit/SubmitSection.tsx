import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Status, useQuestion } from '../../zus-store/question-store'

function SubmitButton({
  onPress,
  disabled,
}: {
  onPress: () => void
  disabled: boolean
}) {
  const status = useQuestion((s) => s.status)

  function getButtonProps() {
    switch (status) {
      case 'idle':
        return {
          title: '⚡️ Check',
          buttonStyle: styles.disabled,
          textStyle: styles.disabledText,
        }
      case 'progress':
        return {
          title: '⚡️ Check',
          buttonStyle: styles.enabled,
          textStyle: styles.enabledText,
        }
      case 'success':
        return {
          title: '⚡️ Continue',
          buttonStyle: styles.success,
          textStyle: styles.enabledText,
        }
      case 'failed':
        return {
          title: '⚡️ Try Again',
          buttonStyle: styles.fail,
          textStyle: styles.enabledText,
        }
    }
  }

  const propsByState = getButtonProps() ?? {
    title: '⚡️ Check',
    buttonStyle: styles.disabled,
    textStyle: styles.disabledText,
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, propsByState.buttonStyle]}
    >
      <Text style={[styles.buttonTitle, propsByState.textStyle]}>
        {propsByState.title}
      </Text>
    </TouchableOpacity>
  )
}

type Props = {
  onSubmit: (status?: Status) => void
}

export default function SubmitSection({ onSubmit }: Props) {
  const status = useQuestion((s) => s.status)
  const onCheckAnswer = useQuestion((s) => s.onCheckAnswer)
  const onReset = useQuestion((s) => s.onReset)
  const success = status === 'success'
  const failed = status === 'failed'
  const progress = status === 'progress'

  const backgroundColor = success
    ? styles.containerSuccess
    : failed
    ? styles.containerFail
    : {}

  const _onSubmit = () => {
    onReset()
    onSubmit(status)
  }

  const onPress = progress ? onCheckAnswer : failed ? onReset : _onSubmit

  const textColor = success ? { color: '#7CC500' } : { color: '#FF4B4C' }
  return (
    <View style={[styles.container, backgroundColor]}>
      {success || failed ? (
        <View style={styles.infoContainer}>
          <Text style={[styles.textColor, textColor]}>
            {success ? '+1 mark' : '0 marks'}
          </Text>
          <View style={styles.actionButtonsContainer}>
            <Text style={styles.action}>📤</Text>
            <Text style={styles.action}>📦</Text>
          </View>
        </View>
      ) : null}
      <SubmitButton disabled={status === 'idle'} onPress={onPress} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '20%',
    justifyContent: 'center',
  },
  containerSuccess: {
    backgroundColor: '#E4FFB7',
  },
  containerFail: {
    backgroundColor: '#FDEEEE',
  },
  button: {
    marginHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1214,
  },
  buttonTitle: {
    fontSize: 20,
    fontWeight: 500,
    paddingVertical: 20,
  },
  disabled: {
    backgroundColor: '#F0F0F0',
  },
  enabled: {
    backgroundColor: '#06B0FF',
  },
  success: {
    backgroundColor: '#7CC500',
  },
  fail: {
    backgroundColor: '#FF4B4C',
  },
  disabledText: {
    color: '#BCBCBE',
  },
  enabledText: {
    color: 'white',
  },
  textColor: {
    fontSize: 22,
    fontWeight: '500',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  action: {
    fontSize: 24,
  },
})
