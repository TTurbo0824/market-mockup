import ItemStore from './ItemStore';
import CartStore from './CartStore';
import UserStore from './UserStore';
import AdminStore from './AdminStore';
import ModalStore from './ModalStore';

export default class RootStore {
  constructor() {
    this.itemStore = new ItemStore(this);
    this.cartStore = new CartStore(this);
    this.userStore = new UserStore(this);
    this.adminStore = new AdminStore(this);
    this.modalStore = new ModalStore(this);
  }

  itemStore: ItemStore;
  cartStore: CartStore;
  userStore: UserStore;
  adminStore: AdminStore;
  modalStore: ModalStore;
}
