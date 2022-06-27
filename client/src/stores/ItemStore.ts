import { makeAutoObservable, computed, toJS, action } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import RootStore from './RootStore';
import { items } from '../database/itemData';

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
  total: number;
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
      getItems: computed,
      getPaidList: computed
    });

    makePersistable(this, {
      name: 'ItemStore',
      properties: ['items', 'paidList'],
      storage: window.localStorage
    });
  }

  items: FullItem[] = items;

  paidList: PaidList[] = [
    {
      id: 0,
      date: '2022-06-15',
      totalPrice: 14000,
      items: [
        {
          id: 4,
          itemName: '물티슈 70매 X 10입(박스)',
          price: 14000,
          quantity: 1,
          img: '../images/items/물티슈.jpg'
        }
      ]
    },
    {
      id: 1,
      date: '2022-06-16',
      totalPrice: 270000,
      items: [
        {
          id: 6,
          itemName: '무선 게이밍 마우스',
          price: 120000,
          quantity: 1,
          img: '../images/items/마우스.jpg'
        },
        {
          id: 7,
          itemName: '향수 100ml',
          price: 150000,
          quantity: 1,
          img: '../images/items/향수.jpg'
        }
      ]
    }
  ];

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

  get getPaidList() {
    return toJS(this.paidList);
  }
}
