import { dbService } from '../../db/db.service'

import {
  IReview, IReviewSubmission, IUserReview, IReviewCreateParams, IAcceptReviewsParams, EReviewStatus
} from 'shared'

export const reviewService = {
  getReviews: (courseId?: number, exerciseId?: number, status: EReviewStatus = EReviewStatus.PENDING) => {
    const courseCondition = courseId ? ' AND course_id=$2' : ''
    const exerciseCondition = exerciseId ? ' AND exercise_id=$3' : ''
    const params = [status, courseId, exerciseId].filter(e => e !== undefined)
    return dbService.queryMany<IReview>(`
      SELECT r.review_id, message, metadata, status, tags, r.timestamp FROM review AS r
      JOIN review_submissions ON r.review_id = review_submissions.review_id
      JOIN submission ON review_submissions.submission_id = submission.submission_id
      WHERE status=$1 ${courseCondition} ${exerciseCondition}
      GROUP BY(r.review_id, message, metadata, status, tags, r.timestamp)
    `, params)
  },
  getReviewSubmissions: (courseId?: number, exerciseId?: number, status: EReviewStatus = EReviewStatus.PENDING) => {
    const courseCondition = courseId ? ' AND course_id=$2' : ''
    const exerciseCondition = exerciseId ? ' AND exercise_id=$3' : ''
    const params = [status, courseId, exerciseId].filter(e => e !== undefined)
    return dbService.queryMany<IReviewSubmission>(`
      SELECT rs.review_id, rs.submission_id, selection FROM review_submissions AS rs
      JOIN submission ON rs.submission_id = submission.submission_id
      JOIN review ON review.review_id = rs.review_id
      WHERE status=$1 ${courseCondition} ${exerciseCondition}
    `, params)
  },
  updateReview: (review: Partial<IReview>) => {
    return undefined
  },
  deleteReview: (reviewId: number) => {
    return undefined
  },
  getUserReviews: async (studentId: number) : Promise<IUserReview[]> => {
    return await dbService.queryMany<IUserReview>(`
      SELECT json_agg(json_build_object(
        'message', review.message,
        'metadata', review.metadata,
        'timestamp', review.timestamp,
        'status', review.status,
        'tags', review.tags,
        'selection', review_submissions.selection
      )) AS reviews, submission.code FROM submission
      JOIN review_submissions ON submission.submission_id = review_submissions.submission_id
      JOIN review ON review.review_id = review_submissions.review_id
      WHERE submission.student_id = $1
      GROUP BY(submission.submission_id, submission.code)
    `, [studentId])
  },
  createReview: async (params: IReviewCreateParams) : Promise<any> => {
    const savedReview = await dbService.queryOne<IReview | undefined>(`
      INSERT INTO review (message, metadata)
      VALUES($1, $2) RETURNING review_id, message, metadata, status, tags, timestamp
    `, [params.message, params.metadata || ''])

    function createValues(params: IReviewCreateParams, reviewId: number) {
      return params.selections.reduce((acc, cur, i) => {
        const start = i === 0 ? '' : `${acc[0]},`
        const str = `${start} ($${acc[1]}, $${acc[1] + 1}, $${acc[1] + 2})`
        const val = [...acc[2], reviewId, cur.submission_id, cur.selection]
        return [str, acc[1] + 3, val]
      }, ['', 1, [] as any])
    }
    const values = createValues(params, savedReview!.review_id)

    type Returned = {
      review_id: number
      submission_id: string
      selection: [number, number, number]
    }
    return dbService.queryMany<Returned>(`
      INSERT INTO review_submissions (review_id, submission_id, selection)
      VALUES ${values[0]} RETURNING review_id, submission_id, selection
    `, values[2])
  },
  acceptPendingReviews: (params: IAcceptReviewsParams) => {
    const updatedValues = params.reviewIds.map((_, i) => ` ($${i + 1})`).join(',')
    return dbService.queryMany<any>(`
      UPDATE review AS r SET status = 'SENT'
      FROM (VALUES ${updatedValues}) AS u(review_id)
      WHERE r.review_id = u.review_id::integer
    `, params.reviewIds)
  }
}
