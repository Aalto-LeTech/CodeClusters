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
  selection: [number, number]
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
  status: EReviewStatus
  tags: string[]
}
export enum EReviewStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
}
export interface IReviewWithSelection extends IReview {
  selection: [number, number]
}
export interface IReviewSelection {
  submission_id: string
  selection: [number, number]
}
export interface IReviewSubmission {
  review_id: number
  submission_id: string
  selection: [number, number]
}
// Review API
export interface IReviewListQueryParams {
  course_id?: number
  exercise_id?: number
  statuses: EReviewStatus[]
}
export interface IReviewCreateFormParams {
  message: string
  metadata?: string
  tags?: string[]
}
export interface IReviewCreateParams extends IReviewCreateFormParams {
  selections: IReviewSelection[]
}
export interface IAcceptReviewsParams {
  reviewIds: number[]
}
// Review submission API
export interface IReviewSubmissionPutParams {
  selection: [number, number]
}
// Review flow
export interface IReviewFlowStep {
  index: number
  action: string
  data: Object
}
export interface IReviewFlow {
  review_flow_id: number
  course_id: number | null
  exercise_id: number | null
  user_id: number
  public?: boolean
  title: string
  description: string
  steps: IReviewFlowStep[]
}
// Review flow API
export interface IReviewFlow {
  course_id: number | null
  exercise_id: number | null
  user_id: number
  title: string
  description: string
  public?: boolean
  tags?: string[]
  steps: IReviewFlowStep[]
}
export interface IReviewFlowCreateFormParams {
  course_id?: number
  exercise_id?: number
  title: string
  description: string
  tags: string[]
}
export interface IReviewFlowCreateParams {
  course_id?: number
  exercise_id?: number
  user_id: number
  title: string
  description: string
  tags: string[]
  steps: IReviewFlowStep[]
}
export interface IReviewFlowRunParams {
  review_flow_id?: number
  steps: IReviewFlowStep[]
}
// Programming language
export enum EProgrammingLanguage {
  JAVA = 'JAVA',
}
export interface IProgrammingLanguageFacets {
  programming_language: EProgrammingLanguage
  tokens: string[]
  metrics: string[]
}
// Course
export interface ICourse {
  course_id: number
  name: string
  organization: string
  default_programming_language: EProgrammingLanguage
  student_ids: number[]
  exercises: IExercise[]
}
export interface IExercise {
  exercise_id: number
  course_id: number
  programming_language: EProgrammingLanguage
  name: string
}
// Submission
type SubmissionWithoutId = Omit<ISubmission, 'submission_id'>
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
// Submission API
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
// User / auth
export interface IUser {
  user_id: number
  name: string
  email: string
  student_id: number | null
  role: Role
}
export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT'
export interface IJwt {
  expires: number
  token: string
}
// User API
export interface IUserCreateParams {
  name: string
  email: string
  password: string
  student_id: number | null
  role: Role
}
export interface ILoginCredentials {
  email: string
  password: string
}
export interface ILoginResponse {
  user: IUser
  jwt: IJwt
}
// Model
export interface IModel {
  model_id: IModelId // basically 'ngram'
  title: string
  description: string
}
export type IModelParams = INgramParams
export type IModelId = 'ngram'
export type IRunModelResponse = IRunNgramResponse
// Ngram model API
export const NgramModelId: 'ngram'
export interface IDBSCANParams {
  name: 'DBSCAN'
  min_samples?: number
  eps?: number
}
export interface IHDBSCANParams {
  name: 'HDBSCAN'
  min_cluster_size?: number
  min_samples?: number
  show_linkage_tree?: boolean
}
export interface IOPTICSParams {
  name: 'OPTICS'
  min_samples?: number
  max_eps?: number
}
export interface IKMeansParams {
  name: 'KMeans'
  k_clusters?: number
}
export interface ITSNEParams {
  name: 'TSNE'
  perplexity?: number
  svd_n_components?: number
}
export interface IUMAPParams {
  name: 'UMAP'
  n_neighbors?: number
  min_dist?: number
  n_components?: number
}
export type ClusteringAlgoType = 'DBSCAN' | 'HDBSCAN' | 'OPTICS' | 'KMeans'
export type ClusteringAlgo = IDBSCANParams | IHDBSCANParams | IOPTICSParams | IKMeansParams
export type DimVisualizationType = 'TSNE' | 'UMAP'
export type DimVisualization = ITSNEParams | IUMAPParams
export type TokenSetType = 'modified' | 'complete' | 'keywords'
export interface INgramParams {
  model_id: IModelId
  token_set?: TokenSetType
  ngrams?: [number, number]
  clustering_params?: ClusteringAlgo
  dim_visualization_params?: DimVisualization
  random_seed?: number
}
export interface IRunNgramParams extends INgramParams {
  submissions: { id: string; code: string }[]
}
export interface IRunNgramResponse {
  model_id: IModelId
  ngram: {
    clusters: { [id: string]: string[] }
    '2d': { id: string; x: number; y: number; cluster: number }[]
    silhouette_score: number | null
  }
  // job_id: number
  // documents_used: number
  // status_url: string
}
// Index data to Solr / update fields
export interface IIndexMetricsParams {
  course_id: number
  exercise_id: number
}
export interface IIndexMetricsResponse {}
// Search with Solr
export interface ISearchCodeParams {
  q: string
  course_id?: number
  exercise_id?: number
  num_results?: number
  num_lines?: number
  results_start?: number
  facets?: {
    [facet: string]: ISearchFacetParams
  }
  facet_filters?: {
    [facet: string]: string[]
  }
  custom_filters?: {
    [key: string]: string | number | []
  }[]
  case_sensitive?: boolean
  regex?: boolean
  whole_words?: boolean
}
export type ISearchFacetParams = true | ISearchFacetRange
export interface ISearchFacetRange {
  start: number
  end: number
  gap: number
}
export interface ISupplementaryData {
  stats: { count: number; course_id: number; exercise_id: number }[]
  facets: IProgrammingLanguageFacets[]
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
  response: ISolrResponse<ISolrMaybeFullSubmission>
  facet_counts?: {
    facet_fields: {
      [facet: string]: (string | number)[]
    }
    facet_ranges?: {
      [facet: string]: {
        counts: (string | number)[]
        start: number
        end: number
        gap: number
      }
    }
  }
  highlighting?: {
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
export interface ISolrMaybeFullSubmission extends ISolrSubmission {
  code?: string[]
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
