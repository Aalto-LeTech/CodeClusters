import { Response, NextFunction } from 'express'
import * as Joi from 'joi'
import { searchService } from './search.service'

// import { CustomError } from '../../common'

import { ISearchParams } from 'shared'
import { IAuthRequest } from '../../types/auth'

export const SEARCH_QUERY_PARAMS = Joi.object({
  q: Joi.string().min(1).max(256).required(),
  course_id: Joi.number().integer(),
  exercise_id: Joi.number().integer(),
  student_ids: Joi.array().items(Joi.number().integer()),
  num_results: Joi.number().integer(),
  num_lines: Joi.number().integer(),
  results_start: Joi.number().integer(),
  filters: Joi.array().items(Joi.string()),
  case_sensitive: Joi.boolean(),
  regex: Joi.boolean(),
  whole_words: Joi.boolean(),
})

export const searchSubmissions = async (req: IAuthRequest<{}, ISearchParams>, res: Response, next: NextFunction) => {
  try {
    const result = await searchService.searchSubmissions(req.queryParams)
    if (result) {
      res.json(result)
    } else {
      res.status(400).json({ message: 'Bad query' })
    }
  } catch (err) {
    next(err)
  }
}
