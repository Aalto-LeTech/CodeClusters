import { computed, action, observable } from 'mobx'

type AppState = 'SEARCH' | 'MODEL'

export class StateStore {
  @observable state: AppState = 'SEARCH'

  @computed get getInactiveState() {
    return this.state === 'SEARCH' ? 'MODEL' : 'SEARCH'
  }

  @action reset() {
    this.state = 'SEARCH'
  }

  @action setToState(state: AppState) {
    this.state = state
  }
}
