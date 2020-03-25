import { action, computed, runInAction, observable } from 'mobx'
import * as reviewFlowApi from '../api/review_flow.api'

import { IReviewFlow } from 'shared'
import { ToastStore } from './ToastStore'

export class ReviewFlowsStore {
  @observable reviewFlows: IReviewFlow[] = []
  @observable selectedFlow?: IReviewFlow = undefined
  toastStore: ToastStore

  constructor(props: ToastStore) {
    this.toastStore = props
  }

  @action reset() {
    this.reviewFlows = []
  }

  @action getReviewFlows = async () => {
    const result = await reviewFlowApi.getReviewFlows()
    runInAction(() => {
      if (result) {
        this.reviewFlows = result.reviewFlows
        this.selectedFlow = result.reviewFlows[0]
      }
    })
    return result
  }
}
