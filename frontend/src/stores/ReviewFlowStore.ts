import { action, computed, runInAction, observable } from 'mobx'
import * as reviewFlowApi from '../api/review_flow.api'

import { IReviewFlow } from 'shared'
import { ToastStore } from './ToastStore'
import { CourseStore } from './CourseStore'
import { AuthStore } from './AuthStore'

export type ReviewFlowFilterType = 'course' | 'exercise' | 'all' | 'user'

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

export class ReviewFlowStore {
  @observable reviewFlows: IReviewFlow[] = []
  @observable currentReviewFlows: IReviewFlow[] = []
  @observable selectedFlow?: IReviewFlow = undefined
  @observable filteredBy: [ReviewFlowFilterType, number] = ['all', 0]
  @observable filterOptions = FILTER_OPTIONS.map(f => ({ ...f, disabled: false }))
  toastStore: ToastStore
  courseStore: CourseStore
  authStore: AuthStore

  constructor(props: { toastStore: ToastStore, courseStore: CourseStore, authStore: AuthStore }) {
    this.toastStore = props.toastStore
    this.courseStore = props.courseStore
    this.authStore = props.authStore
  }

  @computed get getCurrentFilterOption() {
    return FILTER_OPTIONS.find(o => o.key === this.filteredBy[0])!
  }

  @action reset() {
    this.reviewFlows = []
  }

  @action setSelectedFlow(title: string) {
    this.selectedFlow = this.reviewFlows.find(r => r.title === title)
  }

  @action filterReviewFlows(by: ReviewFlowFilterType, id?: number) {
    const course_id = this.courseStore.selectedCourse?.course_id
    const exercise_id = this.courseStore.selectedExercise?.exercise_id
    const user_id = this.authStore.user?.user_id
    this.currentReviewFlows = this.reviewFlows.filter(r => {
      switch (by) {
        case 'course':
          return r.course_id === course_id
        case 'exercise':
          return r.exercise_id === exercise_id
        case 'user':
          return r.user_id === user_id
        case 'all':
        default:
          return r
      }
    })
    this.filteredBy = [by, id || 0]
  }

  @action getReviewFlows = async () => {
    const result = await reviewFlowApi.getReviewFlows()
    runInAction(() => {
      if (result) {
        this.reviewFlows = result.reviewFlows
        this.filterReviewFlows('all')
        this.selectedFlow = result.reviewFlows[0]
      }
    })
    return result && result.reviewFlows || []
  }
}
