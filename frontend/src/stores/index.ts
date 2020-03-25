import { AuthStore } from './AuthStore'
import { ReviewStore } from './ReviewStore'
import { ReviewFlowsStore } from './ReviewFlowsStore'
import { SubmissionStore } from './SubmissionStore'
import { ClusteringStore } from './ClusteringStore'
import { SearchStore } from './SearchStore'
import { ModalStore } from './ModalStore'
import { ToastStore } from './ToastStore'

export class Stores {
  authStore: AuthStore
  reviewStore: ReviewStore
  reviewFlowsStore: ReviewFlowsStore
  submissionStore: SubmissionStore
  clusteringStore: ClusteringStore
  searchStore: SearchStore
  modalStore: ModalStore
  toastStore: ToastStore

  constructor() {
    this.modalStore = new ModalStore()
    this.toastStore = new ToastStore()
    this.authStore = new AuthStore(this.reset)
    this.reviewStore = new ReviewStore(this.toastStore)
    this.reviewFlowsStore = new ReviewFlowsStore(this.toastStore)
    this.submissionStore = new SubmissionStore(this.toastStore)
    this.clusteringStore = new ClusteringStore(this.toastStore)
    this.searchStore = new SearchStore(this.toastStore)
  }

  reset = () => {
    this.authStore.reset()
    this.toastStore.reset()
    this.reviewStore.reset()
    this.reviewFlowsStore.reset()
    this.submissionStore.reset()
    this.clusteringStore.reset()
    this.searchStore.reset()
  }
}
