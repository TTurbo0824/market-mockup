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
  cancelRequestDate: string | null;
  cancelDate: string | null;
}

export default class ItemStore {
  constructor(RootStore: RootStore) {
    makeAutoObservable(this, {
      addToPaidList: action,
      editPaidItemStatus: action,
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
      {
        id,
        uniqueId,
        status: '결제완료',
        date: curDate,
        totalPrice,
        items: items,
        cancelRequestDate: null,
        cancelDate: null,
      },
    ];
  }

  editPaidItemStatus(orderId: number, cancelRequestDate: string) {
    const editedItem = this.paidList.filter((el) => el.id === orderId)[0];
    const idx = this.paidList.indexOf(editedItem);
    editedItem.status = '취소요청';
    editedItem.cancelRequestDate = cancelRequestDate;

    this.paidList = [
      ...this.paidList.slice(0, idx),
      editedItem,
      ...this.paidList.slice(idx + 1, this.paidList.length),
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
