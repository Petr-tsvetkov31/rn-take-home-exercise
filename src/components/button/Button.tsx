import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type Props = {
  title: string
  onPress: () => void
  disabled?: boolean
}

export default function SubmitButton({ title, onPress, disabled }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[styles.button, disabled ? styles.disabled : styles.enabled]}
      >
        <Text
          style={[
            styles.buttonTitle,
            disabled ? styles.disabledText : styles.enabledText,
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    // marginBottom: 20,
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
})
