import { dbService } from '../../db/db.service'

import { IReview, IReviewCreateParams } from 'shared'

export const reviewService = {
  getReviews: async () : Promise<IReview[] | undefined> => {
    return await dbService.queryMany<IReview>(`
      SELECT review_id, submission_id, message, metadata, timestamp FROM review
    `)
  },
  createReview: async (params: IReviewCreateParams) : Promise<IReview | undefined> => {
    const reviews = await dbService.queryOne<IReview | undefined>(`
      INSERT INTO review (submission_id, message, metadata)
      VALUES($1, $2, $3) RETURNING review_id, submission_id, message, metadata, timestamp
    `,
      [params.submission_id, params.message, params.metadata])
    return reviews
  }
}
