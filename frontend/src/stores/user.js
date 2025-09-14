import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { jwtDecode } from 'jwt-decode'

export const useUserStore = defineStore('user', () => {
  // state
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)

  // getters
  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => {
    if (token.value) {
      try {
        const decodedToken = jwtDecode(token.value)
        return decodedToken.role
      } catch (e) {
        console.error('Token inválido:', e)
        logout()
        return null
      }
    }
    return null
  })

  // actions
  function setUser(userData, userToken) {
    user.value = userData
    token.value = userToken
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', userToken)
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return { token, user, isAuthenticated, userRole, setUser, logout }
})
