import { action, computed, runInAction, observable } from 'mobx'
import * as reviewApi from '../api/review.api'

import { IReviewWithDate, IReviewCreateParams, ISolrSubmissionWithDate } from 'shared'
import { ToastStore } from './ToastStore'

export class ReviewStore {
  @observable reviews: IReviewWithDate[] = []
  @observable selectedSubmissions: ISolrSubmissionWithDate[] = []
  @observable openSubmission?: ISolrSubmissionWithDate
  @observable openSelection: [number, number, number] = [0, 0, 0]
  @observable isMultiSelection: boolean = true
  toastStore: ToastStore

  constructor(props: ToastStore) {
    this.toastStore = props
  }

  @computed get hasManySelections() {
    return this.selectedSubmissions.length > 1
  }

  @action reset() {
    this.reviews = []
    this.selectedSubmissions = []
    this.openSubmission = undefined
    this.openSelection = [0, 0, 0]
  }

  @action toggleMultiSelection = () => {
    if (this.isMultiSelection) {
      this.selectedSubmissions = this.selectedSubmissions.filter(s => s.id === this.openSubmission!.id)
    }
    this.isMultiSelection = !this.isMultiSelection
  }

  @action setOpenSubmission(s?: ISolrSubmissionWithDate, selection: [number, number, number] = [0, 0, 0]) {
    if (s && this.isMultiSelection) {
      const found = this.selectedSubmissions.find(ss => ss.id === s.id)
      if (!found) {
        this.selectedSubmissions.push(s)
      }
    } else if (s) {
      this.selectedSubmissions = [s]
    } else if (this.isMultiSelection) {
      this.selectedSubmissions = []
    } else {
      this.selectedSubmissions = this.selectedSubmissions.filter(s => s.id !== this.openSubmission!.id)
    }
    this.openSubmission = s
    this.openSelection = selection
  }

  @action getReviews = async () => {
    const result = await reviewApi.getReviews()
    runInAction(() => {
      if (result) {
        this.reviews = result.reviews.map(r => ({ ...r, date: new Date(r.timestamp) }))
      }
    })
    return result
  }

  @action getUserReviews = async (userId: number) => {
    const result = await reviewApi.getUserReviews(userId)
    runInAction(() => {
      if (result) {
        this.reviews = result.reviews.map(r => ({ ...r, date: new Date(r.timestamp) }))
      }
    })
    return result
  }

  @action addReview = async (payload: IReviewCreateParams) => {
    let result
    try {
      result = await reviewApi.addReview(payload)
      if (result) {
        this.toastStore.createToast('Review sent', 'success')
      }
      return result
    } catch (err) {
      console.log(err)
    }
    return Promise.resolve(undefined)
  }
}
