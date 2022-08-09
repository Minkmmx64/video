import { defineStore } from 'pinia'
interface UserStore{
  AuthToken: string;
}

export const useUserInfo = defineStore('user', {
  state: (): UserStore => {
    return {
      AuthToken:"",
    }
  },
  getters: {

  },
  actions: {
    
  }
})