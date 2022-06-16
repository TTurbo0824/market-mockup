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
      addToCart: action,
      removeFromCart: action,
      removeBulk: action,
      plusQuantity: action,
      minusQuantity: action,
      getCartItems: computed,
      getItemQuant: computed
    });

    makePersistable(this, {
      name: 'CartStore',
      properties: ['cartItems', 'cartItemQuant'],
      storage: window.localStorage
    });
  }

  cartItems = [
    {
      id: 0,
      itemName: '크리넥스 3겹 데코 소프트 30m x 30롤',
      price: '20900',
      category: '식품·생필품',
      img: '../images/크리넥스.jpg'
    },
    {
      id: 3,
      itemName: '올리브 짜파게티 140g X 20입(박스)',
      price: '15900',
      category: '식품·생필품',
      img: '../images/짜파게티.jpg'
    }
  ];

  cartItemQuant = [
    {
      itemId: 0,
      quantity: 1
    },
    {
      itemId: 3,
      quantity: 3
    }
  ];

  addToCart(item: Item) {
    this.cartItems = [...this.cartItems, item];
    this.cartItemQuant = [...this.cartItemQuant, { itemId: item.id, quantity: 1 }];
  }

  removeFromCart(item: Item) {
    this.cartItems = this.cartItems.filter((el) => el.id !== item.id);
    this.cartItemQuant = this.cartItemQuant.filter((el) => el.itemId !== item.id);
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

  get getCartItems() {
    return toJS(this.cartItems);
  }

  get getItemQuant() {
    return toJS(this.cartItemQuant);
  }
}
