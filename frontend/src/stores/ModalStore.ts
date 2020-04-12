import { computed, action, observable } from 'mobx'

export interface IModal {
  isOpen: boolean
  params: any
}

type IModals = {
  [key in EModal]: IModal
}

export enum EModal {
  DELETE_REVIEW_SELECTION = 'DELETE_REVIEW_SELECTION',
  REVIEW_SUBMISSIONS = 'REVIEW_SUBMISSIONS'
}

export class ModalStore {
  @observable modals = {
    [EModal.DELETE_REVIEW_SELECTION]: {
      isOpen: false,
      params: {
        submit: () => undefined,
        count: 0
      }
    },
    [EModal.REVIEW_SUBMISSIONS]: {
      isOpen: false,
      params: {
        submit: () => undefined,
        count: 0
      }
    },
  }

  // @action reset() {
  // }

  @action openModal = (name: EModal, params?: any) => {
    this.modals[name].isOpen = true
    this.modals[name].params = params
  }
 
  @action closeModal = (name: EModal) => {
    this.modals[name].isOpen = false
  }
}
