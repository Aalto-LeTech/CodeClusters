import { AuthStore } from './AuthStore'
import { ReviewStore } from './ReviewStore'
import { SubmissionStore } from './SubmissionStore'
import { ToastStore } from './ToastStore'

export class Stores {
  authStore: AuthStore
  reviewStore: ReviewStore
  submissionStore: SubmissionStore
  toastStore: ToastStore

  constructor() {
    this.toastStore = new ToastStore()
    this.authStore = new AuthStore(this.reset)
    this.reviewStore = new ReviewStore(this.toastStore)
    this.submissionStore = new SubmissionStore(this.toastStore)
  }

  reset = () => {
    this.authStore.reset()
    this.toastStore.reset()
    this.reviewStore.reset()
    this.submissionStore.reset()
  }
}
