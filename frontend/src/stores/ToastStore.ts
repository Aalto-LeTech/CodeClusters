import { action, observable } from 'mobx'

import { IToast, IToastType } from '../types/ui'

export class ToastStore {
  @observable toasts: IToast[] = []
  idCounter: number = 0

  @action reset() {
    this.toasts = []
  }

  @action createToast = (message: string, type: IToastType = 'success', duration: number = 5000) => {
    const newToast = {
      id: this.idCounter,
      message,
      type,
      duration
    }
    this.idCounter += 1
    this.toasts.push(newToast)
    if (this.toasts.length > 2) {
      this.toasts = this.toasts.slice(-2)
    }
  }
 
  @action removeToast = (id: number) => {
    this.toasts = this.toasts.filter(t => t.id !== id)
  }
}
