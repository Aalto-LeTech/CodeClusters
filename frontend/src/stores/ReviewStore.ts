import { action, computed, runInAction, observable } from 'mobx'
import * as reviewApi from '../api/review.api'

import { IReviewedSubmission, IReviewCreateParams, IReviewSelection, ISolrSubmissionWithDate } from 'shared'
import { ToastStore } from './ToastStore'

export class ReviewStore {
  @observable reviewedSubmissions: IReviewedSubmission[] = []
  @observable selectedSubmissions: { [id: string]: IReviewSelection } = {}
  @observable selectedId = ''
  @observable isMultiSelection: boolean = true
  toastStore: ToastStore

  constructor(props: ToastStore) {
    this.toastStore = props
  }

  @computed get currentSelection() {
    if (this.selectedId !== '') {
      return this.selectedSubmissions[this.selectedId]
    }
    return undefined
  }

  @computed get hasCurrentSelection() {
    return this.selectedId !== ''
  }

  @computed get currentSelectionCount() {
    return Object.keys(this.selectedSubmissions).length
  }

  @computed get hasManySelections() {
    return Object.keys(this.selectedSubmissions).length > 1
  }

  getSelection(id: string) : [number, number, number] | undefined {
    const sub = this.selectedSubmissions[id]
    if (sub) {
      return sub.selection
    }
    return undefined
  }

  equalSelection(s1: [number, number, number], s2: [number, number, number]) {
    return s1[0] === s2[0] && s1[1] === s2[1] && s1[2] === s2[2]
  }

  @action reset() {
    this.reviewedSubmissions = []
    this.selectedSubmissions = {}
    this.selectedId = ''
  }

  @action resetSelections() {
    this.selectedSubmissions = {}
    this.selectedId = ''
  }

  @action toggleMultiSelection = () => {
    if (this.isMultiSelection && this.currentSelection) {
      this.selectedSubmissions = { [this.selectedId]: this.currentSelection }
    }
    this.isMultiSelection = !this.isMultiSelection
  }

  @action toggleSelection(s: ISolrSubmissionWithDate, selection: [number, number, number] = [0, 0, 0]) {
    const oldSelection = this.getSelection(s.id)
    const notExistsOrSelectionChanged = oldSelection === undefined || !this.equalSelection(oldSelection, selection)
    if (notExistsOrSelectionChanged && this.isMultiSelection) {
      this.selectedSubmissions[s.id] = {
        submission_id: s.id,
        selection,
      }
      this.selectedId = s.id
    } else if (notExistsOrSelectionChanged) {
      this.selectedSubmissions = {
        [s.id]: {
          submission_id: s.id,
          selection,
        }
      }
      this.selectedId = s.id
    } else if (!this.isMultiSelection) {
      this.selectedSubmissions = {}
      this.selectedId = ''
    } else {
      delete this.selectedSubmissions[s.id]
      this.selectedId = ''
    }
  }

  @action getReviews = async () => {
    const result = await reviewApi.getReviews()
    runInAction(() => {
      if (result) {
        this.reviewedSubmissions = result.reviewedSubmissions
      }
    })
    return result
  }

  @action getUserReviews = async (userId: number) => {
    const result = await reviewApi.getUserReviews(userId)
    runInAction(() => {
      if (result) {
        this.reviewedSubmissions = result.reviewedSubmissions
      }
    })
    return result
  }

  @action addReview = async (message: string, metadata: string) => {
    let result
    const payload = {
      message,
      metadata,
      selections: Object.values(this.selectedSubmissions),
    }
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
