
declare module 'common' {
  export type OmitProp<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
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
    privileges: Privileges
  }
  export type Privileges = 'ADMIN' | 'USER'
}
