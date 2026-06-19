import { ref, computed, onUnmounted } from 'vue'

export function useTimer(initialSecondsValue, onTimeUp) {
  const initialSeconds = ref(initialSecondsValue)
  const secondsLeft = ref(initialSecondsValue)
  const isRunning = ref(false)
  let timerInterval = null

  const formattedTime = computed(() => {
    const hrs = Math.floor(secondsLeft.value / 3600)
    const mins = Math.floor((secondsLeft.value % 3600) / 60)
    const secs = secondsLeft.value % 60
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  })

  const timeTaken = computed(() => Math.max(0, initialSeconds.value - secondsLeft.value))

  const start = () => {
    if (isRunning.value) return
    isRunning.value = true
    timerInterval = setInterval(() => {
      if (secondsLeft.value > 0) {
        secondsLeft.value--
      } else {
        pause()
        if (onTimeUp) onTimeUp()
      }
    }, 1000)
  }

  const pause = () => {
    isRunning.value = false
    if (timerInterval) clearInterval(timerInterval)
  }

  const reset = (newInitial = initialSeconds.value) => {
    pause()
    initialSeconds.value = newInitial
    secondsLeft.value = newInitial
  }

  onUnmounted(() => {
    pause()
  })

  return {
    secondsLeft,
    formattedTime,
    isRunning,
    timeTaken,
    start,
    pause,
    reset
  }
}
