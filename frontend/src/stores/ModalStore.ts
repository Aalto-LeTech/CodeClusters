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
  DELETE_REVIEWS = 'DELETE_REVIEWS',
  EDIT_SUBMISSION_REVIEW = 'EDIT_SUBMISSION_REVIEW',
  REVIEW_SUBMISSIONS = 'REVIEW_SUBMISSIONS',
  SUBMISSION_REVIEWS = 'SUBMISSION_REVIEWS'
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
    [EModal.DELETE_REVIEWS]: {
      isOpen: false,
      params: {
        submit: () => undefined,
        count: 0
      }
    },
    [EModal.EDIT_SUBMISSION_REVIEW]: {
      isOpen: false,
      params: {
        submission: undefined,
        review: undefined,
        reviewSubmission: undefined,
      }
    },
    [EModal.REVIEW_SUBMISSIONS]: {
      isOpen: false,
      params: {
        submit: () => undefined,
        count: 0
      }
    },
    [EModal.SUBMISSION_REVIEWS]: {
      isOpen: false,
      params: {
        submission: {},
        reviews: [],
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
