import { action, makeObservable, observable } from 'mobx'
import { ToastStore } from './ToastStore'

export interface IModal {
  isOpen: boolean
  params: any
}

export enum EModal {
  ACCEPT_EDIT_REVIEW = 'ACCEPT_EDIT_REVIEW',
  DELETE_REVIEW_SELECTION = 'DELETE_REVIEW_SELECTION',
  DELETE_REVIEWS = 'DELETE_REVIEWS',
  EDIT_SUBMISSION_REVIEW = 'EDIT_SUBMISSION_REVIEW',
  REVIEW_SUBMISSIONS = 'REVIEW_SUBMISSIONS',
  VIEW_SUBMISSION_REVIEWS = 'VIEW_SUBMISSION_REVIEWS',
  CREATE_REVIEW_FLOW = 'CREATE_REVIEW_FLOW',
}

export class ModalStore {
  @observable modals = {
    [EModal.ACCEPT_EDIT_REVIEW]: {
      isOpen: false,
      params: {
        review: undefined,
      },
    },
    [EModal.DELETE_REVIEW_SELECTION]: {
      isOpen: false,
      params: {
        submit: () => undefined,
        count: 0,
      },
    },
    [EModal.DELETE_REVIEWS]: {
      isOpen: false,
      params: {
        submit: () => undefined,
        count: 0,
      },
    },
    [EModal.EDIT_SUBMISSION_REVIEW]: {
      isOpen: false,
      params: {
        submission: undefined,
        review: undefined,
        reviewSubmission: undefined,
      },
    },
    [EModal.REVIEW_SUBMISSIONS]: {
      isOpen: false,
      params: {
        submit: () => undefined,
        count: 0,
      },
    },
    [EModal.VIEW_SUBMISSION_REVIEWS]: {
      isOpen: false,
      params: {
        submission: {},
        reviewsWithSelection: [],
      },
    },
    [EModal.CREATE_REVIEW_FLOW]: {
      isOpen: false,
      params: {},
    },
  }
  toastStore: ToastStore

  constructor(toastStore: ToastStore) {
    makeObservable(this)
    this.toastStore = toastStore
  }
  // @action reset() {
  // }

  @action openModal = (name: EModal, params?: any) => {
    this.modals[name].isOpen = true
    this.modals[name].params = params
    this.toastStore.setToasterLocation(true)
  }

  @action closeModal = (name: EModal) => {
    this.modals[name].isOpen = false
    this.toastStore.setToasterLocation(false)
  }
}
