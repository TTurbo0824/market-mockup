import { action, makeAutoObservable, computed, toJS } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import RootStore from './RootStore';

export interface Transaction {
  id: number | null;
  uniqueId: string | null;
  username: string | null;
  name: string | null;
  status: string | null;
  paymentAmount: number | null;
  paymentDate: string;
  canceledAmount: number | null;
  canceledDate: string | null;
}

export interface User {
  id: number | null;
  username: string | null;
  name: string | null;
  userStatus: string | null;
  signupDate: string;
  dormantDate: string | null;
  orderTotal: number | null;
}

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
