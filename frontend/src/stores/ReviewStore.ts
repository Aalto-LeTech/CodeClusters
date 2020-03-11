import { action, runInAction, observable } from 'mobx'
import * as reviewApi from '../api/review.api'

import { IReviewWithDate, IReviewCreateParams, ISolrSubmissionWithDate } from 'shared'
import { ToastStore } from './ToastStore'

export class ReviewStore {
  @observable reviews: IReviewWithDate[] = []
  @observable selectedSubmissions: ISolrSubmissionWithDate[] = []
  @observable openSubmission?: ISolrSubmissionWithDate
  @observable openSelection: [number, number, number] = [0, 0, 0]
  toastStore: ToastStore

  constructor(props: ToastStore) {
    this.toastStore = props
  }

  @action reset() {
    this.reviews = []
  }

  @action setOpenSubmission(s?: ISolrSubmissionWithDate, selection: [number, number, number] = [0, 0, 0]) {
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
