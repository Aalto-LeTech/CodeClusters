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
  filters: Joi.array().items(Joi.string()),
  case_sensitive: Joi.boolean(),
  regex: Joi.boolean(),
  whole_words: Joi.boolean(),
  page: Joi.number().integer()
})

export const searchSubmissions = async (req: IAuthRequest<{}, ISearchParams>, res: Response, next: NextFunction) => {
  try {
    const results = await searchService.searchSubmissions(req.queryParams)
    res.json({ results })
  } catch (err) {
    next(err)
  }
}
