import ItemStore from './ItemStore';
import CartStore from './CartStore';
import UserStore from './UserStore';

export default class RootStore {
  constructor() {
    this.itemStore = new ItemStore(this);
    this.cartStore = new CartStore(this);
    this.userStore = new UserStore(this);
  }

  itemStore: ItemStore;
  cartStore: CartStore;
  userStore: UserStore;
}
