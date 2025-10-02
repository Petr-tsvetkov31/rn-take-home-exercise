import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { useQuestionV2 } from '../../zus-store/question-store-v2'

export type SelectableOption = {
  index: number
  value: string
  selected: boolean
}

type OptionProps = {
  option: SelectableOption
  onPress: (optionIndex: number) => void
}

function Option(props: OptionProps) {
  const {
    option: { index, value, selected },
    onPress,
  } = props

  const _onPress = () => {
    onPress(index)
  }

  const status = useQuestionV2((s) => s.status)
  const success = status === 'success'
  const failed = status === 'failed'
  const selectedStyle = selected
    ? success
      ? styles.success
      : failed
      ? styles.error
      : styles.selected
    : {}

  return (
    <TouchableOpacity
      style={[styles.container, selectedStyle]}
      onPress={_onPress}
    >
      <Text style={styles.text}>{value}</Text>
    </TouchableOpacity>
  )
}

export default function MultipleQuestion() {
  const selectedOptions = useQuestionV2((s) => s.options)
  const setSelectedOptions = useQuestionV2((s) => s.onSelect)

  const onPress = (optionIndex: number) => {
    setSelectedOptions(optionIndex)
  }

  return (
    <>
      {selectedOptions?.map((option) => (
        <Option key={option.value} option={option} onPress={onPress} />
      ))}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginBottom: 8,
    borderRadius: 16,
    borderColor: '#F0F0F0',
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 4,
  },
  text: {
    paddingVertical: 24,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 400,
  },
  selected: {
    backgroundColor: '#DBF3FF',
    borderColor: '#05B0FF',
  },
  success: {
    backgroundColor: '#E4FFB7',
    borderColor: '#7CC500',
  },
  error: {
    backgroundColor: '#FDEEEE',
    borderColor: '#FF4B4C',
  },
})
