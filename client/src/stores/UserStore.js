import { action, makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

export class UserStore {
  rootStore

  user = {
    id: 0,
    userName: 'testuser',
    gender: 'male',
    age: '20-39',
    occupation: 'student'
  }

  constructor(root) {
    makeAutoObservable(this, {
      signIn: action,
      signOut: action
    });

    makePersistable(this, {
      name: 'UserStore',
      properties: ['user'],
      storage: window.localStorage
    });

    this.rootStore = root;
  }

  signIn(user) {
    console.log(user);
  }

  signOut(user) {
    console.log(user);
  }
}
