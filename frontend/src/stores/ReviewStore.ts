import { action, computed, runInAction, observable } from 'mobx'
import * as reviewApi from '../api/review.api'

import {
  IReview, IReviewedSubmission, IReviewCreateParams, IReviewSelection, IReviewSubmission, EReviewStatus
} from 'shared'
import { IGetReviewsParams } from '../types/forms'
import { ToastStore } from './ToastStore'
import { SearchStore } from './SearchStore'
import { LocalSearchStore } from './LocalSearchStore'

interface IProps {
  toastStore: ToastStore
  searchStore: SearchStore
  localSearchStore: LocalSearchStore
}

export class ReviewStore {
  @observable reviews: IReview[] = []
  @observable reviewSubmissions: IReviewSubmission[] = []
  @observable reviewedSubmissions: IReviewedSubmission[] = []
  @observable selectedSubmissions: { [id: string]: IReviewSelection } = {}
  @observable selectedId = ''
  @observable getReviewsParams: IGetReviewsParams = {
    course_id: undefined,
    exercise_id: undefined,
    sent: false,
    pending: true,
  }
  @observable isMultiSelection: boolean = true
  toastStore: ToastStore
  searchStore: SearchStore
  localSearchStore: LocalSearchStore

  constructor(props: IProps) {
    this.toastStore = props.toastStore
    this.searchStore = props.searchStore
    this.localSearchStore = props.localSearchStore
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

  getSelection = (id: string) => {
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

  @action resetSelections = () => {
    this.selectedSubmissions = {}
    this.selectedId = ''
  }

  @action setGetReviewsParams = (params: Partial<IGetReviewsParams>) => {
    this.getReviewsParams = { ...this.getReviewsParams, ...params }
  }

  @action toggleMultiSelection = () => {
    if (this.isMultiSelection && this.currentSelection) {
      this.selectedSubmissions = { [this.selectedId]: this.currentSelection }
    }
    this.isMultiSelection = !this.isMultiSelection
  }

  @action toggleSelection = (submission_id: string, selection: [number, number, number] = [0, 0, 0]) => {
    const oldSelection = this.getSelection(submission_id)
    const notExistsOrSelectionChanged = oldSelection === undefined || !this.equalSelection(oldSelection, selection)
    if (notExistsOrSelectionChanged && this.isMultiSelection) {
      this.selectedSubmissions[submission_id] = {
        submission_id,
        selection,
      }
      this.selectedId = submission_id
    } else if (notExistsOrSelectionChanged) {
      this.selectedSubmissions = {
        [submission_id]: {
          submission_id,
          selection,
        }
      }
      this.selectedId = submission_id
    } else if (!this.isMultiSelection) {
      this.selectedSubmissions = {}
      this.selectedId = ''
    } else {
      delete this.selectedSubmissions[submission_id]
      this.selectedId = ''
    }
  }

  @action toggleSelectShownSubmissions = () => {
    let ids: string[] = []
    if (this.localSearchStore.active) {
      ids = this.localSearchStore.shownSubmissions.map(s => s.id)
    } else {
      ids = this.searchStore.selectedSearchResult.docs.map(s => s.id)
    }
    const atLeastOneUnselected = ids.some(id => !(id in this.selectedSubmissions))
    let newSelections: { [id: string]: IReviewSelection } = {}
    if (atLeastOneUnselected) {
      newSelections = ids.reduce((acc, id) => ({
        ...acc,
        [id]: {
          submission_id: id,
          selection: [0, 0, 0]
        }
      }), { ...this.selectedSubmissions })
    } else {
      newSelections = Object.keys(this.selectedSubmissions).reduce((acc, id) => {
        if (ids.includes(id)) {
          return acc
        }
        return {
          ...acc,
          [id]: this.selectedSubmissions[id]
        }
      }, {})
    }
    this.selectedSubmissions = newSelections
    this.isMultiSelection = true
  }

  @action selectAllSubmissions = async () => {
    let ids: string[] = []
    if (this.localSearchStore.active) {
      ids = this.localSearchStore.submissions.map(s => s.id)
    } else {
      ids = await this.searchStore.searchIds()
    }
    const newSelections: { [id: string]: IReviewSelection } = ids.reduce((acc, id) => ({
      ...acc,
      [id]: {
        submission_id: id,
        selection: [0, 0, 0]
      }
    }), { ...this.selectedSubmissions })
    runInAction(() => {
      this.selectedSubmissions = newSelections
      this.isMultiSelection = true
    })
  }

  @action getReviews = async (courseId?: number, exerciseId?: number) => {
    const statuses = []
    if (this.getReviewsParams.sent) statuses.push(EReviewStatus.SENT)
    if (this.getReviewsParams.pending) statuses.push(EReviewStatus.PENDING)
    const payload = {
      statuses,
      course_id: courseId,
      exercise_id: exerciseId,
    }
    const result = await reviewApi.getReviews(payload)
    runInAction(() => {
      if (result) {
        this.reviews = result.reviews
        this.reviewSubmissions = result.reviewSubmissions
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

  @action addReview = async (message: string, metadata?: string) => {
    const payload = {
      message,
      metadata,
      selections: Object.values(this.selectedSubmissions),
    }
    const result = await reviewApi.addReview(payload)
    if (result) {
      this.toastStore.createToast('Review sent', 'success')
    }
    return result
  }

  @action updateReview = async (reviewId: number, review: IReview) => {
    const result = await reviewApi.updateReview(reviewId, review)
    if (result) {
      runInAction(() => {
        this.reviews = this.reviews.map(r => {
          if (r.review_id === reviewId) {
            return { ...r, ...review }
          }
          return r
        })
      })
      this.toastStore.createToast('Review updated', 'success')
    }
    return result
  }

  @action upsertReviewSubmission = async (reviewSubmission: IReviewSubmission) => {
    const { review_id, submission_id } = reviewSubmission
    const payload = { selection: reviewSubmission.selection }
    const result = await reviewApi.upsertReviewSubmission(review_id, submission_id, payload)
    if (result) {
      runInAction(() => {
        let found = false
        this.reviewSubmissions = this.reviewSubmissions.map(r => {
          if (r.review_id === review_id && r.submission_id === submission_id) {
            found = true
            return reviewSubmission
          }
          return r
        })
        if (!found) {
          this.reviewSubmissions.push(reviewSubmission)
        }
      })
      this.toastStore.createToast('Review submission updated', 'success')
    }
    return result
  }

  @action deleteReviewSubmission = async (reviewId: number, submissionId: string) => {
    const result = await reviewApi.deleteReviewSubmission(reviewId, submissionId)
    if (result) {
      runInAction(() => {
        this.reviewSubmissions = this.reviewSubmissions.filter(r => r.review_id !== reviewId || r.submission_id !== submissionId)
      })
      this.toastStore.createToast('Review submission deleted', 'danger')
    }
    return result
  }

  @action deleteReview = async (reviewId: number) => {
    const result = await reviewApi.deleteReview(reviewId)
    if (result) {
      this.reviews = this.reviews.filter(r => r.review_id !== reviewId)
      this.toastStore.createToast('Review deleted', 'success')
    }
    return result
  }

  @action acceptPendingReviews = async (reviewIds: number[]) => {
    const payload = {
      reviewIds
    }
    const result = await reviewApi.acceptPendingReviews(payload)
    if (result) {
      runInAction(() => {
        this.reviews = this.reviews.filter(r => !reviewIds.includes(r.review_id))
        this.reviewSubmissions = this.reviewSubmissions.filter(rs => !reviewIds.includes(rs.review_id))
        this.toastStore.createToast('Reviews accepted', 'success')
      })
    }
    return result
  }
}
