import CartItemStore from './CartItemStore';
import UserStore from './UserStore';

export default class RootStore {
  constructor() {
    this.cartItemStore = new CartItemStore(this);
    this.userStore = new UserStore(this);
  }

  cartItemStore: CartItemStore;
  userStore: UserStore;
}
