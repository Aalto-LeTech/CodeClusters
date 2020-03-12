export interface IToast {
  id: number
  message: string
  type: string
  duration: number
}

export interface IModal {
  name: string
  isOpen: boolean
  params: any
}
