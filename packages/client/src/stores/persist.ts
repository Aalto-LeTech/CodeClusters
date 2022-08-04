import { reaction } from 'mobx'

export function persist(fn: () => any, setter: (val: any) => void, id: string) {
  const existing = localStorage.getItem(id)
  if (existing && existing !== null && existing.length > 0) {
    let stored = JSON.parse(existing)
    setter(stored)
  }
  return reaction(fn, val => {
    localStorage.setItem(id, JSON.stringify(val || ''))
  })
}
