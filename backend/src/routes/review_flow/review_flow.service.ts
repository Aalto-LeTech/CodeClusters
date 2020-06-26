import { dbService } from '../../db/db.service'

import { IReviewFlow, IReviewFlowCreateParams } from 'shared'

export const reviewFlowService = {
  getReviewFlows: async (userId: number) : Promise<IReviewFlow[]> => {
    return await dbService.queryMany<IReviewFlow>(`
      SELECT review_flow.review_flow_id, course_id, exercise_id, user_id, title, description, tags,
      json_agg(json_build_object(
        'index', review_flow_step.index,
        'action', review_flow_step.action,
        'data', review_flow_step.data
      )) AS steps FROM review_flow
      JOIN review_flow_step ON review_flow_step.review_flow_id = review_flow.review_flow_id
      GROUP BY (review_flow.review_flow_id, course_id, exercise_id, user_id, title, description, tags)
    `, [])
  },
  createReviewFlow: async (params: IReviewFlowCreateParams) : Promise<any> => {
    const reviewFlowParams = [
      params.course_id || null,
      params.exercise_id || null,
      params.user_id,
      params.title,
      params.description || '',
      params.tags
    ]
    const savedReviewFlow = await dbService.queryOne<IReviewFlow | undefined>(`
      INSERT INTO review_flow (course_id, exercise_id, user_id, title, description, tags)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `, reviewFlowParams)

    function createValues(params: IReviewFlowCreateParams, reviewFlowId: number) {
      return params.steps.reduce((acc, cur, i) => {
        const start = i === 0 ? '' : `${acc[0]},`
        const str = `${start} ($${acc[1]}, $${acc[1] + 1}, $${acc[1] + 2}, $${acc[1] + 3})`
        const val = [...acc[2], reviewFlowId, cur.index, cur.action, cur.data]
        return [str, acc[1] + 4, val]
      }, ['', 1, [] as any])
    }
    const values = createValues(params, savedReviewFlow!.review_flow_id)
    console.log(values)
    type Returned = {
      index: number
      action: string
      data: Object
    }
    const steps = await dbService.queryMany<Returned>(`
      INSERT INTO review_flow_step (review_flow_id, index, action, data)
      VALUES ${values[0]} RETURNING index, action, data
    `, values[2])
    return { ...savedReviewFlow, steps }
  }
}
