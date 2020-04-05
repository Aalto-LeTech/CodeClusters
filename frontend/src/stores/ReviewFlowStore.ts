import { action, autorun, computed, runInAction, observable } from 'mobx'
import * as reviewFlowApi from '../api/review_flow.api'

import { IReviewFlow, IReviewFlowRunParams, IRunNgramResponse } from 'shared'
import { ToastStore } from './ToastStore'
import { CourseStore } from './CourseStore'
import { AuthStore } from './AuthStore'
import { SearchStore } from './SearchStore'
import { ModelStore } from './ModelStore'

export type ReviewFlowFilterType = 'course' | 'exercise' | 'all' | 'user'
interface ITabOption {
  key: string
  value: string
  disabled: boolean
  itemCount: number
}

const FILTER_OPTIONS = [
  {
    key: 'exercise',
    value: 'This exercise',
  },
  {
    key: 'course',
    value: 'This course'
  },
  {
    key: 'all',
    value: 'All flows'
  },
  {
    key: 'user',
    value: 'Your flows'
  }
]
const EMPTY_FILTERED_FLOWS = {
  exercise: [],
  course: [],
  all: [],
  user: []
} as { [key: string]: IReviewFlow[] }

interface IProps {
  toastStore: ToastStore
  courseStore: CourseStore
  authStore: AuthStore
  searchStore: SearchStore
  modelStore: ModelStore
}

export class ReviewFlowStore {
  @observable reviewFlows: IReviewFlow[] = []
  @observable selectedFlow?: IReviewFlow = undefined
  @observable filteredBy: ReviewFlowFilterType = 'all'
  @observable filteredFlows: { [key: string]: IReviewFlow[] } = { ...EMPTY_FILTERED_FLOWS }
  @observable tabFilterOptions: ITabOption[] = FILTER_OPTIONS.map(o => ({ ...o, disabled: false, itemCount: 0 }))
  toastStore: ToastStore
  courseStore: CourseStore
  authStore: AuthStore
  searchStore: SearchStore
  modelStore: ModelStore

  constructor(props: IProps) {
    this.toastStore = props.toastStore
    this.courseStore = props.courseStore
    this.authStore = props.authStore
    this.searchStore = props.searchStore
    this.modelStore = props.modelStore
    this.watchFilteringChanges()
  }

  @computed get getCurrentFilterOption() {
    return this.tabFilterOptions.find(o => o.key === this.filteredBy)!
  }

  @computed get getCurrentFlows() {
    return this.filteredFlows[this.filteredBy]
  }

  @action reset() {
    this.reviewFlows = []
  }

  @action setSelectedFlow(title: string) {
    this.selectedFlow = this.reviewFlows.find(r => r.title === title)
  }

  @action setFilteredBy(key: ReviewFlowFilterType) {
    this.filteredBy = key
  }

  @action setFilterOptions() {
    this.tabFilterOptions = FILTER_OPTIONS.map(o => ({
      ...o,
      disabled: this.filteredFlows[o.key].length === 0,
      itemCount: this.filteredFlows[o.key].length
    }))
  }

  @action setFilteredFlows(flows: IReviewFlow[], courseId?: number, exerciseId?: number, userId?: number) {
    this.filteredFlows = flows.reduce((acc, flow) => {
      if (courseId !== undefined && flow.course_id === courseId) {
        acc['course'].push(flow)
      }
      if (exerciseId !== undefined && flow.exercise_id === exerciseId) {
        acc['exercise'].push(flow)
      }
      if (userId !== undefined && flow.user_id === userId) {
        acc['user'].push(flow)
      }
      acc['all'].push(flow)
      return acc
    }, {
        exercise: [],
        course: [],
        all: [],
        user: []
      } as { [key: string]: IReviewFlow[] }
    )
  }

  watchFilteringChanges = () => {
    autorun(() => {
      const courseId = this.courseStore.selectedCourse?.course_id
      const exerciseId = this.courseStore.selectedExercise?.exercise_id
      const userId = this.authStore.user?.user_id
      this.setFilteredFlows(this.reviewFlows, courseId, exerciseId, userId)
      this.setFilterOptions()
    })
  }

  @action getReviewFlows = async () => {
    const result = await reviewFlowApi.getReviewFlows()
    runInAction(() => {
      if (result) {
        this.reviewFlows = result.reviewFlows
        if (result.reviewFlows.length > 0) {
          this.selectedFlow = result.reviewFlows[0]
        }
      }
    })
    return result?.reviewFlows || []
  }

  @action runReviewFlow = async (params: IReviewFlowRunParams) => {
    const result = await reviewFlowApi.runReviewFlow(params)
    runInAction(() => {
      if (result) {
        console.log(result)
        if (result.searchResult) {
          this.searchStore.addSearchResult(result.searchResult)
        }
        if (result.modelingResult && result.modelingResult.model_id === 'ngram') {
          this.modelStore.setLatestRunNgram(result.modelingResult as IRunNgramResponse)
        }
        this.toastStore.createToast('Review flow run', 'success')
      }
    })
    return result
  }
}
