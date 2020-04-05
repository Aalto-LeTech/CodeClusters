import { AuthStore } from './AuthStore'
import { CourseStore } from './CourseStore'
import { ReviewStore } from './ReviewStore'
import { ReviewFlowStore } from './ReviewFlowStore'
import { SubmissionStore } from './SubmissionStore'
import { ModelStore } from './ModelStore'
import { SearchStore } from './SearchStore'
import { ModalStore } from './ModalStore'
import { StateStore } from './StateStore'
import { ToastStore } from './ToastStore'

export class Stores {
  authStore: AuthStore
  courseStore: CourseStore
  reviewStore: ReviewStore
  reviewFlowStore: ReviewFlowStore
  submissionStore: SubmissionStore
  modelStore: ModelStore
  searchStore: SearchStore
  modalStore: ModalStore
  stateStore: StateStore
  toastStore: ToastStore

  constructor() {
    this.modalStore = new ModalStore()
    this.toastStore = new ToastStore()
    this.authStore = new AuthStore(this.reset)
    this.searchStore = new SearchStore(this.toastStore)
    this.courseStore = new CourseStore(this.toastStore)
    this.reviewStore = new ReviewStore(this.toastStore)
    this.submissionStore = new SubmissionStore(this.toastStore)
    this.modelStore = new ModelStore({
      toastStore: this.toastStore,
      searchStore: this.searchStore,
    })
    this.reviewFlowStore = new ReviewFlowStore({
      toastStore: this.toastStore,
      courseStore: this.courseStore,
      authStore: this.authStore,
      searchStore: this.searchStore,
      modelStore: this.modelStore
    })
    this.stateStore = new StateStore()
  }

  reset = () => {
    this.authStore.reset()
    this.toastStore.reset()
    this.courseStore.reset()
    this.reviewStore.reset()
    this.reviewFlowStore.reset()
    this.submissionStore.reset()
    this.modelStore.reset()
    this.searchStore.reset()
    this.stateStore.reset()
  }
}
