import { AuthStore } from './AuthStore'
import { CourseStore } from './CourseStore'
import { ReviewStore } from './ReviewStore'
import { ReviewFlowStore } from './ReviewFlowStore'
import { SubmissionStore } from './SubmissionStore'
import { ClusteringStore } from './ClusteringStore'
import { SearchStore } from './SearchStore'
import { ModalStore } from './ModalStore'
import { ToastStore } from './ToastStore'

export class Stores {
  authStore: AuthStore
  courseStore: CourseStore
  reviewStore: ReviewStore
  reviewFlowStore: ReviewFlowStore
  submissionStore: SubmissionStore
  clusteringStore: ClusteringStore
  searchStore: SearchStore
  modalStore: ModalStore
  toastStore: ToastStore

  constructor() {
    this.modalStore = new ModalStore()
    this.toastStore = new ToastStore()
    this.authStore = new AuthStore(this.reset)
    this.searchStore = new SearchStore(this.toastStore)
    this.courseStore = new CourseStore(this.toastStore)
    this.reviewStore = new ReviewStore(this.toastStore)
    this.reviewFlowStore = new ReviewFlowStore({
      toastStore: this.toastStore,
      searchStore: this.searchStore,
    })
    this.submissionStore = new SubmissionStore(this.toastStore)
    this.clusteringStore = new ClusteringStore(this.toastStore)
  }

  reset = () => {
    this.authStore.reset()
    this.toastStore.reset()
    this.courseStore.reset()
    this.reviewStore.reset()
    this.reviewFlowStore.reset()
    this.submissionStore.reset()
    this.clusteringStore.reset()
    this.searchStore.reset()
  }
}
