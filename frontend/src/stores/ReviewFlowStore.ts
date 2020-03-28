import { action, computed, runInAction, observable } from 'mobx'
import * as reviewFlowApi from '../api/review_flow.api'

import { IReviewFlow } from 'shared'
import { ToastStore } from './ToastStore'
import { SearchStore } from './SearchStore'

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
  searchStore: SearchStore

  constructor(props: { toastStore: ToastStore, searchStore: SearchStore }) {
    this.toastStore = props.toastStore
    this.searchStore = props.searchStore
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
    const {
      course_id,
      exercise_id,
    } = this.searchStore.latestQuery
    console.log(this.searchStore.latestQuery)
    this.currentReviewFlows = this.reviewFlows.filter(r => {
      switch (by) {
        case 'course':
          return r.course_id === course_id
        case 'exercise':
          return r.exercise_id === exercise_id
        case 'user':
          return r.user_id === id
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
