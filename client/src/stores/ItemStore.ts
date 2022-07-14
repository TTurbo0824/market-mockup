import { makeAutoObservable, computed, toJS, action } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import RootStore from './RootStore';

export interface Item {
  id: number;
  itemName: string;
  price: number;
  category: string;
  img: string;
  stock: number;
  status: string;
  sold: number;
}

export interface PaidItem {
  id: number;
  itemName: string;
  price: number;
  quantity: number;
  img: string;
}

interface PaidList {
  id: number;
  uniqueId: string;
  status: string;
  date: string;
  totalPrice: number;
  items: PaidItem[];
}

export default class ItemStore {
  constructor(RootStore: RootStore) {
    makeAutoObservable(this, {
      addToPaidList: action,
      editItems: action,
      importItemList: action,
      importPaidList: action,
      getItems: computed,
      getPaidList: computed,
    });

    makePersistable(this, {
      name: 'ItemStore',
      properties: ['items', 'paidList'],
      storage: window.localStorage,
    });
  }

  items: Item[] = [];

  paidList: PaidList[] = [];

  importItemList(items: Item[]) {
    this.items = items;
  }

  importPaidList(list: PaidList[]) {
    this.paidList = list;
  }

  addToPaidList(items: PaidItem[], id: number, uniqueId: string, curDate: string, totalPrice: number) {
    this.paidList = [
      ...this.paidList,
      { id, uniqueId, status: '결제완료', date: curDate, totalPrice, items: items },
    ];
  }

  editItems(itemStock: number[]) {
    this.items.map((item, idx) => (item.stock = itemStock[idx]));
  }

  get getItems() {
    return toJS(this.items);
  }

  get getPaidList() {
    return toJS(this.paidList);
  }
}
