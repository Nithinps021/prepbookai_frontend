import { ref, watch } from 'vue'

export function useTheme() {
  // Check local storage or default to system preference
  const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        return savedTheme === 'dark'
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  }

  const isDark = ref(getInitialTheme())

  // Apply theme to html element
  const applyTheme = (dark) => {
    if (typeof window === 'undefined') return
    
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }

  // Watch for changes
  watch(isDark, (newDark) => {
    applyTheme(newDark)
  }, { immediate: true })

  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  return {
    isDark,
    toggleTheme
  }
}
