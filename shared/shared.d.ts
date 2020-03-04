
declare module 'shared' {
  export type OmitProp<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

  export type IUserReviewWithDate = OmitProp<IReviewWithDate, 'metadata'>
  export type IUserReview = OmitProp<IReview, 'metadata'>
  export interface IReviewWithDate extends IReview {
    date: Date
  }
  export interface IReview {
    review_id: number
    submission_id: number
    timestamp: string
    message: string
    metadata: string
  }
  export interface IReviewCreateParams {
    submission_id: number
    message: string
    metadata: string
  }

  type SubmissionWithoutId = OmitProp<ISubmission, 'id'>
  export interface ISubmissionCreateParams {
    student_id: number
    course_id: number
    exercise_id: number
    code: string
  }
  export interface ISubmissionWithDate extends ISubmission {
    date: Date
  }
  export interface ISubmission {
    id: number
    student_id: number
    course_id: number
    exercise_id: number
    code: string
    timestamp: string
  }

  export interface IUser {
    id: number
    name: string
    email: string
    student_id: number | null
    role: Role
  }
  export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT'
  export interface ILoginCredentials {
    email: string
    password: string
  }
  export interface ILoginResponse {
    user: IUser
    jwt: IJwt
  }
  export interface IJwt {
    expires: number
    token: string
  }
  export interface IUserCreateParams {
    name: string
    email: string
    password: string
    student_id: number | null
    role: Role
  }
  export interface ISearchParams {
    q: string
    course_id?: number
    exercise_id?: number
    filters?: string[]
    case_sensitive?: boolean
    regex?: boolean
    whole_words?: boolean
    page?: number
  }
  export interface ISearchResponse {
    results: ISubmission[]
  }
  export interface ISearchResult {
    id: number
    student_id: number
    course_id: number
    exercise_id: number
    code: string
    date: Date
  }
  export interface IRunClusteringParams {
    course_id: number
    exercise_id: number
    word_filters: string[]
  }
  export interface IRunClusteringResponse {
    ngram: {
      clusters: {[key: number]: number[]}
      labels: number[]
      params: {
        ngrams: number[]
        n_components: number
      }
    }
    filter: {
      filters: string[]
      ids: number[]
      matches: number[][]
      counts: number[]
      score: number[]
    } | {}
    // job_id: number
    // documents_used: number
    // status_url: string
  }
  export interface ISolrSubmissionResponse {
    responseHeader: {
      status: number
      QTime: number
      params: {
        _: number
        q: string
        id?: number
        student_id?: number
        course_id?: number
        exercise_id?: number
        code?: string
        timestamp?: string
      }
    }
    response: {
      numFound: number
      start: number
      docs: ISolrSubmission[]
      highlighting: {
        [id: string]: {
          code: string
        }
      }
    }
  }
  export interface ISolrSubmission {
    _version_: number
    id: number
    student_id: number
    course_id: number
    exercise_id: number
    code: string[]
    timestamp: string
  }
  export interface ISolrSubmissionWithDate {
    _version_: number
    id: number
    student_id: number
    course_id: number
    exercise_id: number
    code: string[]
    date: Date
  }
}
