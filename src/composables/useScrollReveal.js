/**
 * v-reveal — a lightweight scroll-reveal directive.
 *
 * Adds the `reveal` class on mount, then toggles `is-visible` (which drives the
 * CSS transition in assets/index.css) the first time the element scrolls into
 * view. A single shared IntersectionObserver is reused across all elements.
 *
 * Usage:
 *   <div v-reveal>...</div>
 *   <div v-reveal="120">...</div>   // 120ms stagger delay
 *
 * Honors prefers-reduced-motion by revealing immediately with no animation.
 */

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

let observer = null

function getObserver() {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const el = entry.target
          const delay = Number(el.dataset.revealDelay || 0)
          if (delay) {
            window.setTimeout(() => el.classList.add('is-visible'), delay)
          } else {
            el.classList.add('is-visible')
          }
          observer.unobserve(el)
        }
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
  )
  return observer
}

export const vReveal = {
  mounted(el, binding) {
    // Reduced motion: show immediately, skip the observer entirely.
    if (prefersReducedMotion()) {
      el.classList.add('reveal', 'is-visible')
      return
    }

    el.classList.add('reveal')
    if (binding.value) {
      el.dataset.revealDelay = String(binding.value)
    }
    getObserver().observe(el)
  },
  unmounted(el) {
    if (observer) observer.unobserve(el)
  },
}

export default vReveal
