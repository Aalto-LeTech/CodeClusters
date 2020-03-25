import { dbService } from '../../db/db.service'

import { IReviewFlow, IReviewFlowCreateParams } from 'shared'

export const reviewFlowService = {
  getReviewFlows: async (userId: number) : Promise<IReviewFlow[]> => {
    return await dbService.queryMany<IReviewFlow>(`
      SELECT review_flow.review_flow_id, course_id, exercise_id, user_id, title, description, public, tags,
      json_agg(json_build_object(
        'index', review_flow_step.index,
        'action', review_flow_step.action,
        'parameters', review_flow_step.parameters
      )) AS steps FROM review_flow
      JOIN review_flow_steps ON review_flow.review_flow_id = review_flow_steps.review_flow_id
      JOIN review_flow_step ON review_flow_step.review_flow_step_id = review_flow_steps.review_flow_step_id
      WHERE public=TRUE OR user_id=$1
      GROUP BY (review_flow.review_flow_id, course_id, exercise_id, user_id, title, description, public, tags)
    `, [userId])
  },
  createReviewFlow: async (params: IReviewFlowCreateParams) : Promise<any> => {
    const reviewFlowParams = [
      params.course_id || null,
      params.exercise_id || null,
      params.user_id,
      params.title,
      params.description || '',
      params.public,
      params.tags
    ]
    const savedReviewFlow = await dbService.queryOne<IReviewFlow | undefined>(`
      INSERT INTO review_flow (course_id, exercise_id, user_id, title, description, public, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `, reviewFlowParams)

    function createValues(params: IReviewFlowCreateParams) {
      type insertedRow = [string, number, [number, string, string][]]
      return params.steps.reduce((acc, cur, i) => {
        const start = i === 0 ? '' : `${acc[0]},`
        const str = `${start} ($${acc[1]}, $${acc[1] + 1}, $${acc[1] + 2})`
        const val = [...acc[2], i, cur.action, cur.parameters]
        return [str, acc[1] + 3, val]
      }, ['', 1, []] as insertedRow)
    }
    const values = createValues(params) as any

    const steps = await dbService.queryMany<any>(`
      INSERT INTO review_submissions (review_id, submission_id, selection)
      VALUES ${values[0]} RETURNING review_id, submission_id, selection
    `, values[2])
    return { ...savedReviewFlow, steps }
  }
}
