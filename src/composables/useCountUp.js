import { ref } from 'vue'

/**
 * Animates a number from 0 to `target` using requestAnimationFrame.
 * Call `start()` to begin (e.g. when the element scrolls into view).
 *
 * @param {number} target    final value
 * @param {object} [options]
 * @param {number} [options.duration=1500]  animation length in ms
 * @param {number} [options.decimals=0]     decimal places to display
 * @returns {{ display: import('vue').Ref<string>, start: () => void }}
 */
export function useCountUp(target, options = {}) {
  const { duration = 1500, decimals = 0 } = options
  const display = ref((0).toFixed(decimals))

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let started = false

  const start = () => {
    if (started) return
    started = true

    if (prefersReducedMotion || duration <= 0) {
      display.value = target.toFixed(decimals)
      return
    }

    const begin = performance.now()
    const tick = (now) => {
      const elapsed = now - begin
      const progress = Math.min(elapsed / duration, 1)
      // easeOutCubic for a snappy, decelerating count
      const eased = 1 - Math.pow(1 - progress, 3)
      display.value = (target * eased).toFixed(decimals)
      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        display.value = target.toFixed(decimals)
      }
    }
    requestAnimationFrame(tick)
  }

  return { display, start }
}

export default useCountUp
