import { dbService } from '../../db/db.service'
import { DBError } from '../../common/error'

import { IReviewFlow, IReviewFlowCreateParams } from '@codeclusters/types'

export const reviewFlowService = {
  getReviewFlows: async (userId: number): Promise<IReviewFlow[]> => {
    return await dbService.queryMany<IReviewFlow>(
      `
      SELECT review_flow.review_flow_id, course_id, exercise_id, user_id, title, description, tags,
      json_agg(json_build_object(
        'index', review_flow_step.index,
        'action', review_flow_step.action,
        'data', review_flow_step.data
      )) AS steps FROM review_flow
      JOIN review_flow_step ON review_flow_step.review_flow_id = review_flow.review_flow_id
      GROUP BY (review_flow.review_flow_id, course_id, exercise_id, user_id, title, description, tags)
    `,
      []
    )
  },
  createReviewFlow: async (params: IReviewFlowCreateParams) => {
    return dbService.executeAsTransaction<IReviewFlow>(async (client) => {
      const reviewFlowParams = [
        params.course_id || null,
        params.exercise_id || null,
        params.user_id,
        params.title,
        params.description || '',
        params.tags,
      ]
      const reviewFlowInsert = await client.query(
        `
        INSERT INTO review_flow (course_id, exercise_id, user_id, title, description, tags)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
      `,
        reviewFlowParams
      )
      let savedReviewFlow
      if (reviewFlowInsert.rows && reviewFlowInsert.rows[0]) {
        savedReviewFlow = reviewFlowInsert.rows[0] as Omit<IReviewFlow, 'steps'>
      } else {
        throw new DBError(
          `When inserting review_flow, returned zero rows: ${reviewFlowInsert.rows}`
        )
      }

      function createValues(params: IReviewFlowCreateParams, reviewFlowId: number) {
        return params.steps.reduce(
          (acc, cur, i) => {
            const start = i === 0 ? '' : `${acc[0]},`
            const str = `${start} ($${acc[1]}, $${acc[1] + 1}, $${acc[1] + 2}, $${acc[1] + 3})`
            const val = [...acc[2], reviewFlowId, cur.index, cur.action, cur.data]
            return [str, acc[1] + 4, val]
          },
          ['', 1, [] as any]
        )
      }
      const values = createValues(params, savedReviewFlow!.review_flow_id)

      const reviewFlowStepInsert = await client.query(
        `
        INSERT INTO review_flow_step (review_flow_id, index, action, data)
        VALUES ${values[0]} RETURNING index, action, data
      `,
        values[2]
      )

      if (!reviewFlowStepInsert.rows || reviewFlowStepInsert.rows.length === 0) {
        throw new DBError(
          `When inserting review_flow_steps, returned zero rows: ${reviewFlowStepInsert.rows}`
        )
      }
      return { ...savedReviewFlow, steps: reviewFlowStepInsert.rows }
    })
  },
}
