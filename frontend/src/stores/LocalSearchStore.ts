import { action, computed, runInAction, observable } from 'mobx'

import { persist } from './persist'

import {
  ISearchCodeParams, ISolrFullSubmissionWithDate
} from 'shared'
import { ToastStore } from './ToastStore'

const EMPTY_LOCAL_QUERY: ISearchCodeParams = {
  q: '',
  num_results: 200,
  results_start: 0,
  case_sensitive: false,
}

export class LocalSearchStore {
  // When running models, all submissions are fetched and then passed to modeling server
  // Then different clusters can be quickly visited without having to fetch anything
  @observable searchParams: ISearchCodeParams = EMPTY_LOCAL_QUERY
  @observable submissions: ISolrFullSubmissionWithDate[] = []
  @observable selectedSubmissionIndexes: number[] = []
  @observable searchedSubmissionIndexes: number[] = []
  @observable searchActive: boolean = false
  toastStore: ToastStore

  constructor(props: ToastStore) {
    this.toastStore = props
    persist(() => this.submissions, (val: any) => {
      // Parse dates since JSON.parse wont do it automatically
      this.submissions = val.map((s: any) => ({ ...s, date: new Date(s.date) }))
    }, 'localSearch.submissions')
  }

  @computed get shownSubmissions() {
    const start = this.searchParams.results_start || 0
    const end = start + (this.searchParams.num_results || 200)
    return this.searchedSubmissionIndexes.slice(start, end)
      .map(idx => this.submissions[idx])
  }

  @action reset() {
    this.searchParams = EMPTY_LOCAL_QUERY
    this.submissions = []
    this.selectedSubmissionIndexes = []
    this.searchedSubmissionIndexes = []
    this.searchActive = false
  }

  @action resetLocalSelectedSubmissions = () => {
    this.selectedSubmissionIndexes = this.submissions.map((_, i) => i)
    this.searchedSubmissionIndexes = this.submissions.map((_, i) => i)
  }

  @action setActive = (b: boolean) => {
    this.searchActive = b
  }

  @action toggleActive = (b: boolean) => {
    console.log(this.searchParams)
    if (b) {
      this.searchActive = true
      this.search(this.searchParams)
    } else {
      this.searchActive = false
    }
  }

  @action setSubmissions = (submissions: ISolrFullSubmissionWithDate[]) => {
    this.submissions = submissions
    this.selectedSubmissionIndexes = submissions.map((_, i) => i)
    this.searchedSubmissionIndexes = submissions.map((_, i) => i)
  }

  @action setSelectedSubmissions = (submissionIds: string[]) => {
    runInAction(() => {
      this.searchActive = true
      this.selectedSubmissionIndexes = this.submissions.map((s, i) => {
        if (submissionIds.includes(s.id)) return i
        return -1
      }).filter(n => n !== -1)
      this.searchedSubmissionIndexes = []
    })
  }

  @action setSelectedPage = (page: number) => {
    const numResults = this.searchParams.num_results || 200
    // mobx won't trigger observers of searchParams when non-observable keys are changed (or something)
    // -> set the whole object
    this.searchParams = { ...this.searchParams, ...{ results_start: numResults * (page - 1) } }
  }

  submissionContains(s: ISolrFullSubmissionWithDate, q: string) {
    const code = this.searchParams.case_sensitive ? s.code[0] : s.code[0].toLowerCase()
    const qq = this.searchParams.case_sensitive ? q : q.toLowerCase()
    return code.includes(qq)
  }

  @action search = (payload: ISearchCodeParams) => {
    runInAction(() => {
      this.searchActive = true
      this.searchParams = payload
      this.searchedSubmissionIndexes = this.submissions.map((s, i) => {
        if (this.selectedSubmissionIndexes.includes(i) && this.submissionContains(s, payload.q)) return i
        return -1
      }).filter(n => n !== -1)
    })
  }

  @action searchByIds = (submissionIds: string[]) => {
    runInAction(() => {
      this.searchActive = true
      this.searchedSubmissionIndexes = this.submissions.map((s, i) => {
        if (this.selectedSubmissionIndexes.includes(i) && submissionIds.includes(s.id)) return i
        return -1
      }).filter(n => n !== -1)
    })
  }
}
