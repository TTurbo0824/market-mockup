import { action, makeAutoObservable, computed, toJS } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import RootStore from './RootStore';
import { Transaction, User } from '../interface/Admin';

export default class AdminStore {
  constructor(RootStore: RootStore) {
    makeAutoObservable(this, {
      importUserList: action,
      importTransList: action,
      getTransList: computed,
      getUserList: computed,
    });

    makePersistable(this, {
      name: 'AdminStore',
      properties: ['transactionList', 'userList'],
      storage: window.localStorage,
    });
  }

  transactionList: Transaction[] = [];

  userList: User[] = [];

  importUserList(userList: User[]) {
    this.userList = userList;
  }

  importTransList(transList: Transaction[]) {
    this.transactionList = transList;
  }

  get getTransList() {
    return toJS(this.transactionList);
  }

  get getUserList() {
    return toJS(this.userList);
  }
}
