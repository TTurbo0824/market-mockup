import { makeAutoObservable, computed, toJS, action } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import RootStore from './RootStore';

export interface User {
  isAdmin: boolean;
  token: string | null;
  id: number | null;
  userName: string | null;
  // password: string | null;
  userStatus: string | null;
  signupDate: string | null;
  dormantDate: string | null;
}

export default class UserStore {
  constructor(RootStore: RootStore) {
    makeAutoObservable(this, {
      signIn: action,
      signOut: action,
      getUserType: computed,
      getUserInfo: computed
    });

    makePersistable(this, {
      name: 'UserStore',
      properties: ['userType', 'userInfo'],
      storage: window.localStorage
    });
  }

  userType = 'nonuser';

  userInfo: User = {
    isAdmin: false,
    token: null,
    id: null,
    userName: null,
    userStatus: null,
    signupDate: null,
    dormantDate: null
  };

  signIn(user: User) {
    this.userType = user.isAdmin === true ? 'admin' : 'user';
    this.userInfo = user;
  }

  signOut() {
    this.userType = 'nonuser';

    this.userInfo = {
      isAdmin: false,
      token: null,
      id: null,
      userName: null,
      userStatus: null,
      signupDate: null,
      dormantDate: null
    };
  }

  get getUserType() {
    return toJS(this.userType);
  }

  get getUserInfo() {
    return toJS(this.userInfo);
  }
}
