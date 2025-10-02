import { StyleSheet, View } from 'react-native'

export default function Progress({ percentage }: { percentage: number }) {
  return (
    <View style={styles.container}>
      <View style={[styles.progressBar, { width: `${percentage}%` }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    width: '87%',
    borderRadius: 16,
    height: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#05B0FF',
    borderRadius: 16,
  },
})
