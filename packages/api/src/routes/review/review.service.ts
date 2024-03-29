import { dbService } from '../../db/db.service'
import { DBError } from '../../common/error'

import {
  IReview,
  IReviewSubmission,
  IUserReview,
  IReviewCreateParams,
  IAcceptReviewsParams,
  IReviewListQueryParams,
} from '@codeclusters/types'

export const reviewService = {
  getReviews: (params: IReviewListQueryParams) => {
    const { course_id, exercise_id, statuses } = params
    const queryParams = [...statuses, course_id, exercise_id].filter((e) => e !== undefined)
    const bothStatuses = statuses.length === 2
    const statusCondition = bothStatuses ? '(status=$1 OR status=$2)' : 'status=$1'
    const courseCondition = course_id ? ` AND course_id=$${bothStatuses ? 3 : 2}` : ''
    const exerciseCondition = exercise_id ? ` AND exercise_id=$${bothStatuses ? 4 : 3}` : ''
    return dbService.queryMany<IReview>(
      `
      SELECT r.review_id, message, metadata, status, tags, r.timestamp FROM review AS r
      JOIN review_submissions ON r.review_id = review_submissions.review_id
      JOIN submission ON review_submissions.submission_id = submission.submission_id
      WHERE ${statusCondition} ${courseCondition} ${exerciseCondition}
      GROUP BY(r.review_id, message, metadata, status, tags, r.timestamp)
    `,
      queryParams
    )
  },
  getReviewSubmissions: (params: IReviewListQueryParams) => {
    const { course_id, exercise_id, statuses } = params
    const queryParams = [...statuses, course_id, exercise_id].filter((e) => e !== undefined)
    const bothStatuses = statuses.length === 2
    const statusCondition = bothStatuses ? '(status=$1 OR status=$2)' : 'status=$1'
    const courseCondition = course_id ? ` AND course_id=$${bothStatuses ? 3 : 2}` : ''
    const exerciseCondition = exercise_id ? ` AND exercise_id=$${bothStatuses ? 4 : 3}` : ''
    return dbService.queryMany<IReviewSubmission>(
      `
      SELECT rs.review_id, rs.submission_id, selection FROM review_submissions AS rs
      JOIN submission ON rs.submission_id = submission.submission_id
      JOIN review ON review.review_id = rs.review_id
      WHERE ${statusCondition} ${courseCondition} ${exerciseCondition}
    `,
      queryParams
    )
  },
  updateReview: (reviewId: number, review: Partial<IReview>) => {
    return dbService.queryOne<any>(
      `
      UPDATE review SET message = $2, metadata = $3, tags = $4
      WHERE review_id = $1
      RETURNING review_id
    `,
      [reviewId, review.message, review.metadata, review.tags]
    )
  },
  deleteReview: (reviewId: number) => {
    return undefined
  },
  getUserReviews: async (studentId: number): Promise<IUserReview[]> => {
    return await dbService.queryMany<IUserReview>(
      `
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
    `,
      [studentId]
    )
  },
  createReview: async (params: IReviewCreateParams) => {
    return dbService.executeAsTransaction<[IReview, any[]]>(async (client) => {
      const reviewInsert = await client.query(
        `
        INSERT INTO review (message, metadata, tags)
        VALUES($1, $2, $3) RETURNING review_id, message, metadata, status, tags, timestamp
      `,
        [params.message, params.metadata || '', params.tags || []]
      )
      let savedReview
      if (reviewInsert.rows && reviewInsert.rows[0]) {
        savedReview = reviewInsert.rows[0] as IReview
      } else {
        throw new DBError(`When inserting review, returned zero rows: ${reviewInsert.rows}`)
      }

      function createValues(params: IReviewCreateParams, reviewId: number) {
        return params.selections.reduce(
          (acc, cur, i) => {
            const start = i === 0 ? '' : `${acc[0]},`
            const str = `${start} ($${acc[1]}, $${acc[1] + 1}, $${acc[1] + 2})`
            const val = [...acc[2], reviewId, cur.submission_id, cur.selection]
            return [str, acc[1] + 3, val]
          },
          ['', 1, [] as any]
        )
      }
      const values = createValues(params, savedReview!.review_id)

      const reviewSubmissionsInsert = await client.query(
        `
        INSERT INTO review_submissions (review_id, submission_id, selection)
        VALUES ${values[0]} RETURNING review_id, submission_id, selection
      `,
        values[2]
      )

      if (!reviewSubmissionsInsert.rows || reviewSubmissionsInsert.rows.length === 0) {
        throw new DBError(
          `When inserting review_submissions, returned zero rows: ${reviewSubmissionsInsert.rows}`
        )
      }
      return [savedReview, reviewSubmissionsInsert.rows]
    })
  },
  acceptPendingReviews: (params: IAcceptReviewsParams) => {
    const updatedValues = params.reviewIds.map((_, i) => ` ($${i + 1})`).join(',')
    return dbService.queryMany<any>(
      `
      UPDATE review AS r SET status = 'SENT'
      FROM (VALUES ${updatedValues}) AS u(review_id)
      WHERE r.review_id = u.review_id::integer
    `,
      params.reviewIds
    )
  },
}
