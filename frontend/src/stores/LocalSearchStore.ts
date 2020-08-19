import { action, computed, runInAction, observable } from 'mobx'

import { persist } from './persist'

import {
  ISearchCodeParams, ISolrFullSubmissionWithDate
} from 'shared'
import { ToastStore } from './ToastStore'

const EMPTY_LOCAL_QUERY: ISearchCodeParams = {
  q: '',
  num_results: 200,
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
    return this.searchedSubmissionIndexes.slice(0, this.searchParams.num_results)
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

  @action setSubmissions = (submissions: ISolrFullSubmissionWithDate[]) => {
    this.submissions = submissions
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

  @action search = (payload: ISearchCodeParams) => {
    runInAction(() => {
      this.searchActive = true
      this.searchParams = payload
      const q = !payload.case_sensitive ? payload.q.toLowerCase() : payload.q
      this.searchedSubmissionIndexes = this.submissions.map((s, i) => {
        if (this.selectedSubmissionIndexes.includes(i) && s.code[0].includes(q)) return i
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
