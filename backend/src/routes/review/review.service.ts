import { dbService } from '../../db/db.service'

import { IReview, IUserReview, IReviewCreateParams } from 'shared'

export const reviewService = {
  getReviews: async () : Promise<IReview[]> => {
    return await dbService.queryMany<IReview>(`
    SELECT json_agg(json_build_object(
      'message', review.message,
      'metadata', review.metadata,
      'timestamp', review.timestamp,
      'selection', review_submissions.selection
    )) AS reviews, submission.code FROM submission
    JOIN review_submissions ON submission.submission_id = review_submissions.submission_id
    JOIN review ON review.review_id = review_submissions.review_id
    GROUP BY(submission.submission_id, submission.code)
    `)
  },
  getUserReviews: async (studentId: number) : Promise<IUserReview[]> => {
    return await dbService.queryMany<IUserReview>(`
      SELECT json_agg(json_build_object(
        'message', review.message,
        'metadata', review.metadata,
        'timestamp', review.timestamp,
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
      VALUES($1, $2) RETURNING review_id, message, metadata, timestamp
    `, [params.message, params.metadata || ''])

    function createValues(params: IReviewCreateParams, reviewId: number) {
      return params.selections.reduce((acc, cur, i) => {
        const start = i === 0 ? '' : `${acc[0]},`
        const str = `${start} ($${acc[1]}, $${acc[1] + 1}, $${acc[1] + 2})`
        const val = [...acc[2], reviewId, parseInt(cur.submission_id, 10), cur.selection]
        return [str, acc[1] + 3, val]
      }, ['', 1, [] as any])
    }
    const values = createValues(params, savedReview!.review_id)

    type Returned = {
      review_id: number
      submission_id: number
      selection: [number, number, number]
    }
    return dbService.queryMany<Returned>(`
      INSERT INTO review_submissions (review_id, submission_id, selection)
      VALUES ${values[0]} RETURNING review_id, submission_id, selection
    `, values[2])
  }
}
