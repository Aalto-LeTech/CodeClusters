import { dbService } from '../../db/db.service'

export const reviewSubmissionService = {
  upsertReviewSubmission: (reviewId: string, submissionId: string, selection: [number, number]) => {
    return dbService.queryOne<any>(
      `
      INSERT INTO review_submissions (selection, review_id, submission_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (review_id, submission_id)
      DO UPDATE
      SET selection = $1
      WHERE review_submissions.review_id = $2 AND review_submissions.submission_id = $3
    `,
      [selection, reviewId, submissionId]
    )
  },
  deleteReviewSubmission: (reviewId: string, submissionId: string) => {
    return dbService.queryOne<any>(
      `
      DELETE FROM review_submissions
      WHERE review_id = $1 AND submission_id = $2
    `,
      [reviewId, submissionId]
    )
  },
}
