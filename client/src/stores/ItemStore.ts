import { makeAutoObservable, computed, toJS } from 'mobx';
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

export default class ItemStore {
  constructor(RootStore: RootStore) {
    makeAutoObservable(this, {
      getItems: computed
    });

    makePersistable(this, {
      name: 'ItemStore',
      properties: ['items'],
      storage: window.localStorage
    });
  }

  items = items;

  get getItems() {
    return toJS(this.items);
  }
}
