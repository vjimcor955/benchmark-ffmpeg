import {defineStore} from 'pinia'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: {
      id: '',
      name: '',
      email: '',
      user: '',
      password: '',
      token: ''
    },
    isLogged: false,
  }),
  actions: {
    logIn(user) {
      this.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        user: user.user,
        password: user.password,
        token: user.token
      }
      this.isLogged = true
    },
    logOut() {
      this.user = {
        id: '',
        name: '',
        email: '',
        user: '',
        password: '',
        token: ''
      }
      this.isLogged = false
    }
  },
  persist: {
    enabled: true,
    strategies : [
      {
        key: "auth",
        storage: localStorage,
      }
    ]
  }
})

export default useAuthStore