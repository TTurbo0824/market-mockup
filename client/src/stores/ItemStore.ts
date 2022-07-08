import { makeAutoObservable, computed, toJS, action } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import RootStore from './RootStore';

export interface Item {
  id: number;
  itemName: string;
  price: number;
  category: string;
  img: string;
}

export interface FullItem {
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
  date: string;
  totalPrice: number;
  items: PaidItem[];
}

export default class ItemStore {
  constructor(RootStore: RootStore) {
    makeAutoObservable(this, {
      addToPaidList: action,
      editItems: action,
      importAdminList: action,
      importItemList: action,
      importPaidList: action,
      getItems: computed,
      getPaidList: computed,
      getAllItems: computed
    });

    makePersistable(this, {
      name: 'ItemStore',
      properties: ['items', 'paidList', 'allItems'],
      storage: window.localStorage
    });
  }

  items: FullItem[] = [];

  allItems: Item[] = [];

  paidList: PaidList[] = [];

  importAdminList(items: FullItem[]) {
    this.items = items;
  }

  importItemList(items: Item[]) {
    this.allItems = items;
  }

  importPaidList(list: PaidList[]) {
    this.paidList = list;
  }

  addToPaidList(items: PaidItem[], curDate: string, totalPrice: number) {
    this.paidList = [
      ...this.paidList,
      { id: this.paidList.length + 1, date: curDate, totalPrice, items: items }
    ];
  }

  editItems(itemStock: number[]) {
    this.items.map((item, idx) => (item.stock = itemStock[idx]));
  }

  get getItems() {
    return toJS(this.items);
  }

  get getAllItems() {
    return toJS(this.allItems)
  }

  get getPaidList() {
    return toJS(this.paidList);
  }
}
