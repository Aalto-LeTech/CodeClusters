
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
}
