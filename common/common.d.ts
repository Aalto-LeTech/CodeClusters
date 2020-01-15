type OmitProp<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

declare module 'common' {
  export interface IReportWithDate extends SubmissionWithoutId {
    report_id: number
    message: string
    date: Date
  }
  export interface IReport extends SubmissionWithoutId {
    report_id: number
    message: string
  }
  type SubmissionWithoutId = OmitProp<ISubmission, 'id'>
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
