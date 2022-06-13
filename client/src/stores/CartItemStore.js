import { action, makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

export class CartItemStore {
  rootStore

  items = {
  }

  constructor(root) {
    makeAutoObservable(this, {
      addToCart: action,
      removeFromCart: action
    });

    makePersistable(this, {
      name: 'CartItemStore',
      properties: ['items'],
      storage: window.localStorage,
    });

    this.rootStore = root;
  }
  
  addToCart(item) {
    console.log(item)
  }

  removeFromCart(item) {
    console.log(item)
  }
}