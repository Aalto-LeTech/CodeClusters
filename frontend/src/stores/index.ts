import { AuthStore } from './AuthStore'
import { CourseStore } from './CourseStore'
import { ReviewStore } from './ReviewStore'
import { SubmissionStore } from './SubmissionStore'
import { ClustersStore } from './ClustersStore'
import { SearchStore } from './SearchStore'
import { LocalSearchStore } from './LocalSearchStore'
import { ModelStore } from './ModelStore'
import { ReviewFlowStore } from './ReviewFlowStore'
import { ModalStore } from './ModalStore'
import { ToastStore } from './ToastStore'

export class Stores {
  authStore: AuthStore
  courseStore: CourseStore
  reviewStore: ReviewStore
  submissionStore: SubmissionStore
  clustersStore: ClustersStore
  searchStore: SearchStore
  localSearchStore: LocalSearchStore
  modelStore: ModelStore
  reviewFlowStore: ReviewFlowStore
  modalStore: ModalStore
  toastStore: ToastStore

  constructor() {
    this.modalStore = new ModalStore()
    this.toastStore = new ToastStore()
    this.authStore = new AuthStore(this.reset)
    this.localSearchStore = new LocalSearchStore(this.toastStore)
    this.courseStore = new CourseStore(this.toastStore)
    this.reviewStore = new ReviewStore(this.toastStore)
    this.submissionStore = new SubmissionStore(this.toastStore)
    this.searchStore = new SearchStore({
      toastStore: this.toastStore,
      localSearchStore: this.localSearchStore,
    })
    this.clustersStore = new ClustersStore({
      toastStore: this.toastStore,
      localSearchStore: this.localSearchStore,
    })
    this.modelStore = new ModelStore({
      toastStore: this.toastStore,
      searchStore: this.searchStore,
      localSearchStore: this.localSearchStore,
      clustersStore: this.clustersStore,
    })
    this.reviewFlowStore = new ReviewFlowStore({
      toastStore: this.toastStore,
      courseStore: this.courseStore,
      authStore: this.authStore,
      clustersStore: this.clustersStore,
      searchStore: this.searchStore,
      modelStore: this.modelStore
    })
  }

  reset = () => {
    this.authStore.reset()
    this.toastStore.reset()
    this.courseStore.reset()
    this.reviewStore.reset()
    this.searchStore.reset()
    this.localSearchStore.reset()
    this.submissionStore.reset()
    this.clustersStore.reset()
    this.modelStore.reset()
    this.reviewFlowStore.reset()
  }
}
