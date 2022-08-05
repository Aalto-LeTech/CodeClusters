export interface ISearchQueryParams {
  query: string
  course_id?: number
  exercise_id?: number
  filters?: string[]
  case_sensitive?: boolean
  regex?: boolean
  whole_words?: boolean
}
