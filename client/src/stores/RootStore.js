import { CartItemStore } from './CartItemStore';
import { UserStore } from './UserStore';

export class RootStore {
  CartItemStore
  UserStore

  constructor() {
    this.cartItemStore = new CartItemStore(this);
    this.userStores = new UserStore(this);
  }
}
