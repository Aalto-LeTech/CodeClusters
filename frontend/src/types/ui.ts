export type IToastType = 'success' | 'danger' | 'warning' | 'info'

export interface IToast {
  id: number
  message: string
  type: IToastType
  duration: number
}

export interface IModal {
  name: string
  isOpen: boolean
  params: any
}
