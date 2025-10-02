import { StyleSheet, TextInput } from 'react-native'

type Props = {
  value: string | undefined
  onChange: (text: string) => void
  placeholder: string
  onSubmitEditing?: () => void
  secureTextEntry?: boolean
  ref?: React.Ref<TextInput> | null
}

export default function Input(props: Props) {
  const {
    value,
    onChange,
    placeholder,
    onSubmitEditing,
    secureTextEntry,
    ref,
  } = props

  return (
    <TextInput
      ref={ref}
      style={styles.input}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      onSubmitEditing={onSubmitEditing}
    />
  )
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    borderColor: '#F0F0F0',
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 4,
  },
})
