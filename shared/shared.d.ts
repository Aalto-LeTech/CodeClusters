declare module 'shared' {
  // Utils
  export function createQueryParams(obj: {[key: string]: string | number}) : string

  // Review
  export type IUserReviewWithDate = Omit<IReviewWithDate, 'metadata'>
  export type IUserReview = Omit<IReview, 'metadata'>
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
  export interface IReviewWithSelection extends IReview {
    selection: [number, number, number]
  }
  export interface IReviewSelection {
    submission_id: string
    selection: [number, number, number]
  }
  export interface IReviewSubmission {
    review_id: number
    submission_id: string
    selection: [number, number, number]
  }
  // Review API
  export interface IReviewListQueryParams {
    course_id?: number
    exercise_id?: number
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
  type SubmissionWithoutId = Omit<ISubmission, 'submission_id'>
  export interface ISubmissionListQueryParams {
    course_id?: number
    exercise_id?: number
  }
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
    submission_id: string
    student_id: number
    course_id: number
    exercise_id: number
    code: string
    timestamp: string
  }
  // User / auth
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
  // Model
  export interface IModel {
    model_id: string // basically 'ngram'
    title: string
    description: string
  }
  export const NgramModelId: 'ngram'
  export type IModelParams = IRunNgramParams
  export type IRunModelResponse = IRunNgramResponse
  export interface IRunNgramParams {
    model_id: string
    ngrams?: [number, number]
    n_components?: number
    submissions: { id: string, code: string }[]
  }
  export interface IRunNgramResponse {
    model_id: string
    ngram: {
      clusters: {[key: string]: string[]}
      labels: number[]
      TSNE: { id: string, x: number, y: number, cluster: number }[]
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
  // Search with Solr
  export interface ISearchCodeParams {
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
  export interface ISolrResponseHeader {
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
  export interface ISolrResponse<T> {
    numFound: number
    start: number
    docs: T[]
  }
  export interface ISolrSearchCodeResponse {
    responseHeader: ISolrResponseHeader
    response: ISolrResponse<ISolrSubmission>
    highlighting: {
      [id: string]: {
        code: string[]
      }
    }
  }
  export interface ISolrSearchAllCodeResponse {
    responseHeader: ISolrResponseHeader
    response: ISolrResponse<ISolrFullSubmission>
  }
  export interface ISolrSearchAllIdsResponse {	
    responseHeader: ISolrResponseHeader	
    response: ISolrResponse<ISolrSubmission>	
  }
  export interface ISolrSubmission {
    _version_: number
    id: string
    student_id: number
    course_id: number
    exercise_id: number
    timestamp: string
  }
  export interface ISolrSubmissionWithDate extends Omit<ISolrSubmission, 'timestamp'> {
    highlighted: string[]
    date: Date
  }
  export interface ISolrFullSubmission extends ISolrSubmission {
    code: string[]
  }
  export interface ISolrFullSubmissionWithDate extends Omit<ISolrFullSubmission, 'timestamp'> {
    date: Date
  }
  export type ISearchCodeResponse = ISolrResponse<ISolrSubmissionWithDate>
  export interface ISearchCodeResult extends ISearchCodeResponse {
    params: ISearchCodeParams
  }
  export interface ISearchAllCodeResult extends ISolrResponse<ISolrFullSubmissionWithDate> {
    params: ISearchCodeParams
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
