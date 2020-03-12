import { action, computed, runInAction, observable } from 'mobx'
import * as reviewApi from '../api/review.api'

import { IReviewWithDate, IReviewCreateParams, IReviewSelection, ISolrSubmissionWithDate } from 'shared'
import { ToastStore } from './ToastStore'

export class ReviewStore {
  @observable reviews: IReviewWithDate[] = []
  @observable openSelections: { [id: string]: IReviewSelection } = {}
  @observable selected = ''
  @observable isMultiSelection: boolean = true
  toastStore: ToastStore

  constructor(props: ToastStore) {
    this.toastStore = props
  }

  @computed get currentSelection() {
    if (this.selected !== '') {
      return this.openSelections[this.selected]
    }
    return undefined
  }

  @computed get hasCurrentSelection() {
    return this.selected !== ''
  }

  @computed get currentSelectionCount() {
    return Object.keys(this.openSelections).length
  }

  @computed get hasManySelections() {
    return Object.keys(this.openSelections).length > 1
  }

  getSelection(id: string) : IReviewSelection | undefined {
    return this.openSelections[id]
  }

  @action reset() {
    this.reviews = []
    this.openSelections = {}
    this.selected = ''
  }

  @action toggleMultiSelection = () => {
    if (this.isMultiSelection && this.currentSelection) {
      this.openSelections = { [this.selected]: this.currentSelection }
    }
    this.isMultiSelection = !this.isMultiSelection
  }

  @action setOpenSubmission(s?: ISolrSubmissionWithDate, selection: [number, number, number] = [0, 0, 0]) {
    if (s && this.isMultiSelection) {
      this.openSelections[s.id] = {
        submission_id: s.id,
        selection,
      }
      this.selected = s.id
    } else if (s) {
      this.openSelections = {
        [s.id]: {
          submission_id: s.id,
          selection,
        }
      }
      this.selected = s.id
    } else if (this.isMultiSelection) {
      this.openSelections = {}
      this.selected = ''
    } else {
      delete this.openSelections[this.selected]
      this.selected = ''
    }
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
