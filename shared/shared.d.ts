
declare module 'shared' {
  export type OmitProp<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

  // Review
  export type IUserReviewWithDate = OmitProp<IReviewWithDate, 'metadata'>
  export type IUserReview = OmitProp<IReview, 'metadata'>
  export interface IReviewWithDate extends IReview {
    date: Date
  }
  export interface IReviewBody {
    message: string
    metadata: string
    timestamp: string
    selection: [number, number, number]
  }
  export interface IReviewedSubmission {
    reviews: IReviewBody[]
    code: string
  }
  export interface IReview {
    review_id: number
    message: string
    metadata: string
    timestamp: string
    status: 'PENDING' | 'SENT'
    tags: string[]
  }
  export interface IReviewCreateParams {
    selections: IReviewSelection[]
    message: string
    metadata?: string
  }
  // Course
  export interface ICourse {
    course_id: number
    name: string
    organization: string
    student_ids: number[]
    exercises: IExercise[]
  }
  export interface IExercise {
    exercise_id: number
    course_id: number
    name: string
  }
  // Submission
  type SubmissionWithoutId = OmitProp<ISubmission, 'submission_id'>
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
    submission_id: number
    student_id: number
    course_id: number
    exercise_id: number
    code: string
    timestamp: string
  }

  export interface IUser {
    user_id: number
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
    num_results?: number
    num_lines?: number
    result_start?: number
    filters?: string[]
    case_sensitive?: boolean
    regex?: boolean
    whole_words?: boolean
  }
  export interface IRunNgramParams {
    model: string
    ngrams?: [number, number]
    n_components?: number
    submission_ids: string[]
  }
  export interface IRunNgramResponse {
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
  export interface ISolrSearchResponse {
    responseHeader: {
      status: number
      QTime: number
      params: {
        _: number
        q: string
        id?: string
        student_id?: number
        course_id?: number
        exercise_id?: number
        timestamp?: string
      }
    }
    response: {
      numFound: number
      start: number
      docs: ISolrSubmission[]
    }
    highlighting: {
      [id: string]: {
        code: string[]
      }
    }
  }
  export interface ISolrSubmission {
    _version_: number
    id: string
    student_id: number
    course_id: number
    exercise_id: number
    timestamp: string
  }
  export interface ISolrSubmissionWithDate {
    _version_: number
    id: string
    student_id: number
    course_id: number
    exercise_id: number
    highlighted: string[]
    date: Date
  }
  // Search
  export interface ISearchResponse {
    numFound: number
    start: number
    results: ISearchResult[]
  }
  export interface ISearchResult {
    id: string
    student_id: number
    course_id: number
    exercise_id: number
    code: string
    date: Date
  }
  export interface IReviewSelection {
    submission_id: string
    selection: [number, number, number]
  }
  // Review flow
  export interface IReviewFlowStep {
    index: number
    action: string
    parameters: string
  }
  export interface IReviewFlow {
    review_flow_id: number
    course_id: number | null
    exercise_id: number | null
    user_id: number
    public: boolean
    title: string
    description: string
    steps: IReviewFlowStep[]
  }
  export interface IReviewFlowCreateParams {
    course_id: number | null
    exercise_id: number | null
    user_id: number
    title: string
    description: string
    public?: boolean
    tags?: string[]
    steps: IReviewFlowStep[]
  }
  export interface IReviewFlowRunParams {
    review_flow_id?: number
    steps: IReviewFlowStep[]
  }
}
