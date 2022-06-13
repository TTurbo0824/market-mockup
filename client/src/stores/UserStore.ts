import { action, makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import RootStore from './RootStore';

export interface User {
  id: number;
  userName: string;
  gender: string;
  age: string;
  occupation: string;
}

export default class UserStore {
  constructor(RootStore: RootStore) {
    makeAutoObservable(this, {
      signIn: action,
      signOut: action
    });

    makePersistable(this, {
      name: 'UserStore',
      properties: ['user'],
      storage: window.localStorage
    });
  }

  user = {
    id: 0,
    userName: 'testuser',
    gender: 'male',
    age: '20-39',
    occupation: 'student'
  };

  signIn(user: User[]) {
    console.log(user);
  }

  signOut(user: User[]) {
    console.log(user);
  }
}
