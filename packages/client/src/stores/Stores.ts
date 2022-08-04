import { AuthStore } from './AuthStore'
import { ClustersStore } from './ClustersStore'
import { CourseStore } from './CourseStore'
import { IndexStore } from './IndexStore'
import { LocalSearchStore } from './LocalSearchStore'
import { ModalStore } from './ModalStore'
import { ModelStore } from './ModelStore'
import { ReviewStore } from './ReviewStore'
import { ReviewFlowStore } from './ReviewFlowStore'
import { SearchStore } from './SearchStore'
import { SearchFacetsStore } from './SearchFacetsStore'
import { SubmissionStore } from './SubmissionStore'
import { ToastStore } from './ToastStore'

export class Stores {
  authStore: AuthStore
  clustersStore: ClustersStore
  courseStore: CourseStore
  localSearchStore: LocalSearchStore
  modalStore: ModalStore
  modelStore: ModelStore
  reviewStore: ReviewStore
  reviewFlowStore: ReviewFlowStore
  searchStore: SearchStore
  searchFacetsStore: SearchFacetsStore
  indexStore: IndexStore
  submissionStore: SubmissionStore
  toastStore: ToastStore

  constructor() {
    this.authStore = new AuthStore(this.reset)
    this.toastStore = new ToastStore()
    this.modalStore = new ModalStore(this.toastStore)
    this.courseStore = new CourseStore(this.toastStore)
    this.localSearchStore = new LocalSearchStore(this.toastStore)
    this.indexStore = new IndexStore(this.toastStore)
    this.submissionStore = new SubmissionStore(this.toastStore)
    this.searchFacetsStore = new SearchFacetsStore({
      toastStore: this.toastStore,
      courseStore: this.courseStore,
    })
    this.searchStore = new SearchStore({
      toastStore: this.toastStore,
      localSearchStore: this.localSearchStore,
      searchFacetsStore: this.searchFacetsStore,
    })
    this.clustersStore = new ClustersStore({
      toastStore: this.toastStore,
      localSearchStore: this.localSearchStore,
    })
    this.reviewStore = new ReviewStore({
      toastStore: this.toastStore,
      searchStore: this.searchStore,
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
      modelStore: this.modelStore,
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
