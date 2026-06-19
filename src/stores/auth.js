import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/mock/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const isAuthenticated = ref(!!token.value)
  const isLoading = ref(false)
  const error = ref(null)

  const login = async (email, password) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.login(email, password)
      token.value = response.token
      user.value = response.user
      isAuthenticated.value = true
      localStorage.setItem('token', response.token)
    } catch (err) {
      error.value = err.message || 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const signup = async (name, email, password) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.signup(name, email, password)
      token.value = response.token
      user.value = response.user
      isAuthenticated.value = true
      localStorage.setItem('token', response.token)
    } catch (err) {
      error.value = err.message || 'Signup failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
  }

  const fetchProfile = async () => {
    if (!token.value) return
    try {
      const profile = await api.getUserProfile()
      user.value = profile
    } catch (err) {
      console.error('Failed to fetch profile', err)
      if (err.message === 'Unauthorized') {
        logout()
      }
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    fetchProfile
  }
})
