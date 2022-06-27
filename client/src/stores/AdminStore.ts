import { action, makeAutoObservable, computed, toJS } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import RootStore from './RootStore';
import { transactionData } from '../database/transactionData';
import { userData } from '../database/userData';
import { getDate } from '../components/utils/_var';

interface TransPayload {
  userName: string;
  paymentAmount: number | null;
}

export default class AdminStore {
  constructor(RootStore: RootStore) {
    makeAutoObservable(this, {
      addTransaction: action,
      getTransList: computed,
      getUserList: computed
    });

    makePersistable(this, {
      name: 'AdminStore',
      properties: ['transactionList', 'userList'],
      storage: window.localStorage
    });
  }

  transactionList = transactionData;

  userList = userData;

  addTransaction(payload: TransPayload) {
    const lastItemId = this.transactionList[this.transactionList.length - 1].transactionId;
    const transaction = {
      transactionId: lastItemId + 1,
      userName: payload.userName,
      paymentDate: getDate(),
      paymentAmount: payload.paymentAmount,
      status: '결제완료',
      canceledAmount: null,
      canceledDate: null
    };

    this.transactionList = [...this.transactionList, transaction];
  }

  get getTransList() {
    return toJS(this.transactionList);
  }

  get getUserList() {
    return toJS(this.userList);
  }
}
