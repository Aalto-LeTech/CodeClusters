import { computed, action, observable } from 'mobx'

import { IModal } from '../types/ui'

interface IModals {
  [key: string]: {
    isOpen: boolean
    params: any
  } 
}

export class ModalStore {
  @observable modals = {
    deleteReviewSelection: {
      isOpen: true,
      params: {
        submit: () => undefined,
        count: 0
      }
    }
  }

  // @action reset() {
  // }

  @computed get deleteReviewSelectionModal() {
    return this.modals['deleteReviewSelection']
  }

  @action openModal = (name: string, params?: any) => {
    this.modals[name].isOpen = true
    this.modals[name].params = params
  }
 
  @action closeModal = (name: string) => {
    this.modals[name].isOpen = false
  }
}
