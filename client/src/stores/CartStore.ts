import { action, makeAutoObservable, computed, toJS } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import RootStore from './RootStore';
import { Item } from '../stores/ItemStore';

export interface ItemQuant {
  itemId: number;
  quantity: number;
}

export default class CartStore {
  constructor(RootStore: RootStore) {
    makeAutoObservable(this, {
      setUpCart: action,
      addToCart: action,
      removeFromCart: action,
      removeBulk: action,
      plusQuantity: action,
      minusQuantity: action,
      setToBeDeleted: action,
      getCartItems: computed,
      getItemQuant: computed
    });

    makePersistable(this, {
      name: 'CartStore',
      properties: ['cartItems', 'cartItemQuant', 'toBeDeleted'],
      storage: window.localStorage
    });
  }

  cartItems: Item[] = [];

  cartItemQuant: ItemQuant[] = [];

  toBeDeleted: number[] = [];

  setUpCart(items: Item[], cartQuant: ItemQuant[]) {
    this.cartItems = items;
    this.cartItemQuant = cartQuant;
  }

  addToCart(item: Item) {
    this.cartItems = [...this.cartItems, item];
    this.cartItemQuant = [...this.cartItemQuant, { itemId: item.id, quantity: 1 }];
  }

  removeFromCart(itemId: number) {
    this.cartItems = this.cartItems.filter((el) => el.id !== itemId);
    this.cartItemQuant = this.cartItemQuant.filter((el) => el.itemId !== itemId);
  }

  removeBulk(idArr: Number[]) {
    this.cartItems = this.cartItems.filter((el) => !idArr.includes(el.id));
    this.cartItemQuant = this.cartItemQuant.filter((el) => !idArr.includes(el.itemId));
  }

  plusQuantity(itemId: number) {
    this.cartItemQuant = this.cartItemQuant.map((el) => {
      if (el.itemId === itemId) el.quantity += 1;
      return el;
    });
  }

  minusQuantity(itemId: number) {
    this.cartItemQuant = this.cartItemQuant.map((el) => {
      if (el.itemId === itemId) el.quantity -= 1;
      return el;
    });
  }

  setToBeDeleted(itemArr: number[]) {
    this.toBeDeleted = [...itemArr];
  }

  get getCartItems() {
    return toJS(this.cartItems);
  }

  get getItemQuant() {
    return toJS(this.cartItemQuant);
  }
}
