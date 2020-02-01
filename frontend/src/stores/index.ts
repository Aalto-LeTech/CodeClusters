import { AuthStore } from './AuthStore'
import { ReviewStore } from './ReviewStore'
import { SubmissionStore } from './SubmissionStore'
import { ClusteringStore } from './ClusteringStore'
import { ToastStore } from './ToastStore'

export class Stores {
  authStore: AuthStore
  reviewStore: ReviewStore
  submissionStore: SubmissionStore
  clusteringStore: ClusteringStore
  toastStore: ToastStore

  constructor() {
    this.toastStore = new ToastStore()
    this.authStore = new AuthStore(this.reset)
    this.reviewStore = new ReviewStore(this.toastStore)
    this.submissionStore = new SubmissionStore(this.toastStore)
    this.clusteringStore = new ClusteringStore(this.toastStore)
  }

  reset = () => {
    this.authStore.reset()
    this.toastStore.reset()
    this.reviewStore.reset()
    this.submissionStore.reset()
    this.clusteringStore.reset()
  }
}
