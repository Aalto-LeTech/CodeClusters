import { AuthStore } from './AuthStore'
import { ReportStore } from './ReportStore'
import { ToastStore } from './ToastStore'

export class Stores {
  authStore: AuthStore
  reportStore: ReportStore
  toastStore: ToastStore

  constructor() {
    this.authStore = new AuthStore()
    this.reportStore = new ReportStore()
    this.toastStore = new ToastStore()
  }
}
