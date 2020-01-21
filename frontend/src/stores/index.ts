import { AuthStore } from './AuthStore'
import { ReportStore } from './ReportStore'
import { SubmissionStore } from './SubmissionStore'
import { ToastStore } from './ToastStore'

export class Stores {
  authStore: AuthStore
  reportStore: ReportStore
  submissionStore: SubmissionStore
  toastStore: ToastStore

  constructor() {
    this.toastStore = new ToastStore()
    this.authStore = new AuthStore()
    this.reportStore = new ReportStore()
    this.submissionStore = new SubmissionStore(this.toastStore)
  }
}
