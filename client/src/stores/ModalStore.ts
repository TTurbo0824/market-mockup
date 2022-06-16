import { action, makeAutoObservable, computed, toJS } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import RootStore from './RootStore';

export default class ModalStore {
  constructor(RootStore: RootStore) {
    makeAutoObservable(this, {
      openModal: action,
      closeModal: action,
      modalInfo: computed
    });

    makePersistable(this, {
      name: 'ModalStore',
      properties: ['modal'],
      storage: window.localStorage
    });
  }

  modal = {
    open: false,
    message: ''
  };

  openModal(message: string) {
    this.modal.open = true;
    this.modal.message = message;
  }

  closeModal() {
    this.modal.open = false;
    this.modal.message = '';
  }

  get modalInfo() {
    return toJS(this.modal);
  }
}
