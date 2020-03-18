import { dbService } from '../../db/db.service'

import { IReview, IUserReview, IReviewCreateParams } from 'shared'

export const reviewService = {
  getReviews: async (studentId?: number) : Promise<IReview[]> => {
    if (studentId) {
      return await dbService.queryMany<IReview>(`
        SELECT review_id, submission_id, message, metadata, review.timestamp FROM review
        JOIN submission ON submission_id = submission.id
        WHERE submission.student_id = $1
      `, [studentId])
    }
    return await dbService.queryMany<IReview>(`
      SELECT review_id, submission_id, message, metadata, timestamp FROM review
    `)
  },
  getUserReviews: async (studentId: number) : Promise<IUserReview[]> => {
    return await dbService.queryMany<IUserReview>(`
      SELECT review_id, message, review.timestamp FROM review
      JOIN review_submissions ON review_id = review_submissions.review_id
      WHERE submission.student_id = $1
    `, [studentId])
  },
  createReview: async (params: IReviewCreateParams) : Promise<any> => {
    const savedReview = await dbService.queryOne<IReview | undefined>(`
      INSERT INTO review (message, metadata)
      VALUES($1, $2) RETURNING review_id, message, metadata, timestamp
    `, [params.message, params.metadata])

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
