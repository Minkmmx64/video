import { defineStore } from 'pinia';
import UserApi from "@/api/Apis/user";

export interface UserStore{
  AuthToken: string;
  userId: number;
}

export interface UserInfo{
  UserName: string;
  avatar: string;
}

export interface User{
  Auth: UserStore,
  Info: UserInfo
}

export const useUserInfo = defineStore('user', {
  state: (): User => {
    return {
      Auth: {
        AuthToken: "",
        userId: -1,
      },
      Info: {
        UserName: "",
        avatar: "",
      }
    }
  },
  getters: {
    UserGetter: (state) => state,
  },
  actions: {
    SetAuthToken(replay: UserStore): Promise<void> {
      return new Promise((resolve, reject) => {
        this.Auth.AuthToken = replay.AuthToken;
        this.Auth.userId = replay.userId;
        sessionStorage.setItem("AuthToken", replay.AuthToken);
        //加载用户信息
        UserApi.userInfo().then(userInfo => {
          const User = userInfo.data.body;
          this.Info.avatar = User.user_avatar || "http://cdn.minkm.top/base/16571623728446r6l3o1d2W4l2l8e4H7o157defaultAvatar.png";
          this.Info.UserName = User.user_name;
          this.SetUserInfo();
          resolve();
        }).catch(error => {
          reject(error);
          this.RemoverUserInfo();
        })
      });
    },
    SetUserInfo() {
      sessionStorage.setItem("UserInfo", JSON.stringify(this.$state));
    },
    RemoverUserInfo() {
      sessionStorage.removeItem("AuthToken");
      sessionStorage.removeItem("UserInfo");
    }
  },
});