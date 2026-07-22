import { defineStore } from 'pinia'
import { ref } from 'vue'
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth, googleProvider } from '@/firebase'
import { api } from '@/mock/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(true) // Start loading to wait for auth state
  const error = ref(null)

  // Initialize auth state listener
  onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      user.value = {
        id: currentUser.uid,
        name: currentUser.displayName,
        email: currentUser.email,
        photoURL: currentUser.photoURL
      }
      token.value = await currentUser.getIdToken()
      isAuthenticated.value = true
    } else {
      user.value = null
      token.value = null
      isAuthenticated.value = false
    }
    isLoading.value = false
  })

  const loginWithGoogle = async () => {
    isLoading.value = true
    error.value = null
    try {
      const result = await signInWithPopup(auth, googleProvider)
      
      // Register/sync user with backend only on active login/signup
      if (result && result.user) {
        try {
          await api.registerUser(result.user.email, result.user.phoneNumber)
        } catch (err) {
          // Ignore 409 Conflict if they already exist, log other errors
          if (!err.message?.includes('409')) {
             console.error('Failed to sync user with backend:', err)
          }
        }
      }
      
      // State is handled by onAuthStateChanged
    } catch (err) {
      error.value = err.message || 'Google login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      // State is handled by onAuthStateChanged
    } catch (err) {
      console.error('Logout failed', err)
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    loginWithGoogle,
    logout
  }
})
