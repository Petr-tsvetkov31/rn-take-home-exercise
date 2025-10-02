import { StyleSheet, Text, View } from 'react-native'

export default function Heading({ heading }: { heading: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{heading}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F7FB',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    marginBottom: 16,
  },
  heading: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 400,
  },
})
