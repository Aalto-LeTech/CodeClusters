import { action, computed, runInAction, observable } from 'mobx'

import { persist } from './persist'

import {
  ISearchCodeParams, ISearchCodeResult, ISolrFullSubmissionWithDate
} from 'shared'
import { ToastStore } from './ToastStore'

const EMPTY_QUERY: ISearchCodeParams = {
  q: '',
  num_results: 200,
  case_sensitive: false,
}

export class LocalSearchStore {
  @observable active: boolean = false
  @observable submissions: ISolrFullSubmissionWithDate[] = []
  @observable foundSubmissionsIndexes: number[] = []
  @observable searchResults: ISearchCodeResult[] = []
  @observable searchParams: ISearchCodeParams = EMPTY_QUERY
  toastStore: ToastStore

  constructor(props: ToastStore) {
    this.toastStore = props
    persist(() => this.submissions, (val: any) => {
      // Parse dates since JSON.parse wont do it automatically
      this.submissions = val.map((s: any) => ({ ...s, date: new Date(s.date) }))
    }, 'localSearch.submissions')
  }

  @computed get shownSubmissions() {
    return this.foundSubmissionsIndexes.slice(0, this.searchParams.num_results).map(idx => this.submissions[idx])
  }

  @action reset() {
    this.searchResults = []
  }

  @action setActive(b: boolean) {
    this.active = b
  }

  @action setSubmissions(submissions: ISolrFullSubmissionWithDate[]) {
    this.submissions = submissions
  }

  @action search = (payload: ISearchCodeParams) => {
    runInAction(() => {
      this.searchParams = payload
      const q = !payload.case_sensitive ? payload.q.toLowerCase() : payload.q
      this.foundSubmissionsIndexes = this.submissions.map((s, i) => {
        if (s.code[0].includes(q)) return i
        return -1
      }).filter(n => n !== -1)
    })
  }

  @action searchByIds = (submissionIds: string[]) => {
    runInAction(() => {
      if (!this.active) this.active = true
      this.foundSubmissionsIndexes = this.submissions.map((s, i) => {
        if (submissionIds.includes(s.id)) return i
        return -1
      }).filter(n => n !== -1)
    })
  }
}
