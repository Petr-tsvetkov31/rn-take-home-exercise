import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler'
import { scheduleOnRN } from 'react-native-worklets'
import { useQuestion } from '../../zus-store/question-store'
import { SortQuestionData } from '../../api/queryQuestions'

function getCategoryIndex(
  x: number,
  y: number,
  layouts: LayoutParams[]
): number {
  'worklet'

  // Find which category contains the drop point
  for (let i = 0; i < layouts.length; i++) {
    const layout = layouts[i]
    if (
      x >= layout.pageX &&
      x <= layout.pageX + layout.width &&
      y >= layout.pageY &&
      y <= layout.pageY + layout.height
    ) {
      return i
    }
  }

  return -1
}

export default function SortQuestion() {
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const startX = useSharedValue(0)
  const startY = useSharedValue(0)
  const answerInitialPosition = useSharedValue({ x: 0, y: 0 })
  const answerWidth = useSharedValue(0)
  const answerHeight = useSharedValue(0)
  const categoryLayouts = useSharedValue<LayoutParams[]>([])

  const question = useQuestion((s) => s.question)
  const selectedCategoryIndex = useQuestion((s) => s.selectedCategoryIndex)
  const onSelectCategory = useQuestion((s) => s.onSelectCategory)
  const status = useQuestion((s) => s.status)

  const answerRef = useRef<View>(null)

  // Measure answer's initial position
  useLayoutEffect(() => {
    answerRef.current?.measure((x, y, width, height, pageX, pageY) => {
      answerInitialPosition.value = { x: pageX, y: pageY }
      answerWidth.value = width
      answerHeight.value = height
    })
  }, [])

  const bounceBack = useCallback(() => {
    'worklet'
    scheduleOnRN(onSelectCategory, -1)
    translateX.value = withSpring(0)
    translateY.value = withSpring(0)
  }, [onSelectCategory])

  useEffect(() => {
    if (selectedCategoryIndex === undefined) {
      bounceBack()
    }
  }, [selectedCategoryIndex, bounceBack])

  const bounceIntoCategory = (categoryIndex: number) => {
    'worklet'
    const targetLayout = categoryLayouts.value[categoryIndex]
    if (!targetLayout) {
      bounceBack()
      return
    }

    // Calculate the center position of the target category
    const categoryCenter = {
      x: targetLayout.pageX + targetLayout.width / 2,
      y: targetLayout.pageY + targetLayout.height / 2,
    }

    // Calculate required translation to move from initial position to target
    const targetX =
      categoryCenter.x - answerInitialPosition.value.x - answerWidth.value / 2
    const targetY =
      categoryCenter.y - answerInitialPosition.value.y - answerHeight.value / 2

    translateX.value = withSpring(targetX)
    translateY.value = withSpring(targetY)

    scheduleOnRN(onSelectCategory, categoryIndex)
  }

  const panGesture = Gesture.Pan()
    .onStart(() => {
      'worklet'
      startX.value = translateX.value
      startY.value = translateY.value
    })
    .onUpdate((event) => {
      'worklet'
      translateX.value = startX.value + event.translationX
      translateY.value = startY.value + event.translationY
    })
    .onEnd((event) => {
      'worklet'
      const dropX = event.absoluteX
      const dropY = event.absoluteY

      // Check which category zone the answer was dropped in
      const categoryIndex = getCategoryIndex(
        dropX,
        dropY,
        categoryLayouts.value
      )

      if (categoryIndex !== -1) {
        bounceIntoCategory(categoryIndex)
      } else {
        bounceBack()
      }
    })

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    }
  })

  const onCategoryLayout = (event: LayoutParams, index: number) => {
    categoryLayouts.modify((value) => {
      'worklet'
      value[index] = event
      return value
    })
  }

  const style =
    status === 'progress'
      ? styles.selected
      : status === 'success'
      ? styles.success
      : status === 'failed'
      ? styles.error
      : {}

  const questionData = question?.questionData as SortQuestionData
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.categoriesContainer}>
        {questionData?.categories?.map((category, index) => (
          <Category
            key={index}
            index={index}
            category={category}
            onLayout={onCategoryLayout}
            style={selectedCategoryIndex === index ? style : {}}
          />
        ))}
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View
          ref={answerRef}
          style={[styles.answer, animatedStyle, style]}
        >
          <Text style={styles.answerText}>
            {question?.questionData.options[0].option}
          </Text>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  )
}

type LayoutParams = {
  x: number
  y: number
  width: number
  height: number
  pageX: number
  pageY: number
}

function Category({
  index,
  category,
  onLayout,
  style,
}: {
  index: number
  category: string
  onLayout: (event: LayoutParams, index: number) => void
  style: any
}) {
  const targetRef = useRef<View>(null)

  useLayoutEffect(() => {
    targetRef.current?.measure((x, y, width, height, pageX, pageY) => {
      onLayout({ x, y, width, height, pageX, pageY }, index)
    })
  }, [])

  return (
    <View ref={targetRef} style={[styles.category, style]}>
      <Text style={styles.categoryText}>{category}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoriesContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  category: {
    flexBasis: '45%',
    height: '30%',
    backgroundColor: '#F7F7FB80',
    opacity: 0.5,
    borderRadius: 24,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ECEBF2',
    borderStyle: 'dashed',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  categoryText: {
    fontSize: 17,
    fontWeight: 800,
    color: '#4C4C4C80',
  },
  answer: {
    padding: 16,
    backgroundColor: '#FCFCFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    borderColor: '#F0F0F0',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 4,
    elevation: 5,
  },
  answerText: {
    color: '#595959',
    fontSize: 15,
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
