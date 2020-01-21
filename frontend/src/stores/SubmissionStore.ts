import { action, runInAction, observable } from 'mobx'
import * as submitApi from '../api/submission.api'

import { ISubmissionCreateParams } from 'common'
import { ToastStore } from './ToastStore'

export class SubmissionStore {
  toastStore: ToastStore
  constructor(props: ToastStore) {
    this.toastStore = props
  }
  @action addSubmission = async (payload: ISubmissionCreateParams) => {
    let result
    try {
      result = await submitApi.addSubmission(payload)
      this.toastStore.createToast('Submission sent', 'success')
      return result
    } catch (err) {
      console.log(err)
    }
    return Promise.resolve(undefined)
  }
}
