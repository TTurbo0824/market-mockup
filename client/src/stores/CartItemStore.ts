import { action, makeAutoObservable, computed, toJS } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import RootStore from './RootStore';
import { items } from '../database/items';

export interface Item {
  id: number;
  itemName: string;
  price: string;
  category: string;
  img: string;
}

export default class CartItemStore {
  constructor(RootStore: RootStore) {
    makeAutoObservable(this, {
      addToCart: action,
      removeFromCart: action,
      getItems: computed
    });

    makePersistable(this, {
      name: 'CartItemStore',
      properties: ['items'],
      storage: window.localStorage
    });
  }

  items = items;

  addToCart(item: Item[]) {
    console.log(item);
  }

  removeFromCart(item: Item[]) {
    console.log(item);
  }

  get getItems() {
    return toJS(this.items);
  }
}
