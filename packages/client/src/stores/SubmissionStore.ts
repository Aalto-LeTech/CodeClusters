import { action, runInAction, makeObservable, observable } from 'mobx'
import * as submitApi from '../api/submission.api'

import { ISubmissionWithDate, ISubmissionCreateParams } from '@codeclusters/types'
import { ToastStore } from './ToastStore'

export class SubmissionStore {
  @observable submissions: ISubmissionWithDate[] = []
  toastStore: ToastStore

  constructor(props: ToastStore) {
    makeObservable(this)
    this.toastStore = props
  }

  @action reset() {
    this.submissions = []
  }

  @action getSubmissions = async (courseId?: number, exerciseId?: number) => {
    const payload = {
      course_id: courseId,
      exercise_id: exerciseId,
    }
    const result = await submitApi.getSubmissions(payload)
    runInAction(() => {
      if (result) {
        this.submissions = result.submissions.map((s) => ({
          ...s,
          date: new Date(s.timestamp),
        })) as ISubmissionWithDate[]
      }
    })
    return result
  }

  @action addSubmission = async (payload: ISubmissionCreateParams) => {
    let result
    try {
      result = await submitApi.addSubmission(payload)
      if (result) {
        this.toastStore.createToast('Submission sent', 'success')
      }
      return result
    } catch (err) {
      console.log(err)
    }
    return Promise.resolve(undefined)
  }
}
