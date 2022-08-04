import { Response, NextFunction } from 'express'
import Joi from 'joi'
import { searchService } from './search.service'

// import { CustomError } from '../../common'

import { ISearchCodeParams, ISolrSearchCodeResponse } from '@codeclusters/types'
import { AuthResponse, IAuthRequest } from '../../types/request'

const FACET_PARAMS = Joi.object({
  start: Joi.number().integer().required(),
  end: Joi.number().integer().required(),
  gap: Joi.number().integer().required(),
})

export const SEARCH_QUERY_PARAMS = Joi.object({
  q: Joi.string().min(1).max(256).required(),
  course_id: Joi.number().integer(),
  exercise_id: Joi.number().integer(),
  student_ids: Joi.array().items(Joi.number().integer()),
  num_results: Joi.number().integer(),
  num_lines: Joi.number().integer(),
  results_start: Joi.number().integer(),
  facets: Joi.object({
    NCSS_method_metric: Joi.alternatives().try(Joi.boolean(), FACET_PARAMS),
    NCSS_class_metric: Joi.alternatives().try(Joi.boolean(), FACET_PARAMS),
    NCSS_file_metric: Joi.alternatives().try(Joi.boolean(), FACET_PARAMS),
    CYC_metric: Joi.alternatives().try(Joi.boolean(), FACET_PARAMS),
    NPath_metric: Joi.alternatives().try(Joi.boolean(), FACET_PARAMS),
    CDAC_metric: Joi.alternatives().try(Joi.boolean(), FACET_PARAMS),
    CFOC_metric: Joi.alternatives().try(Joi.boolean(), FACET_PARAMS),
    bool_expression_metric: Joi.alternatives().try(Joi.boolean(), FACET_PARAMS),
    LOC_metric: Joi.alternatives().try(Joi.boolean(), FACET_PARAMS),
    keywords: Joi.alternatives().try(Joi.boolean(), FACET_PARAMS),
    rare_keywords: Joi.alternatives().try(Joi.boolean(), FACET_PARAMS),
  }),
  facet_filters: Joi.object({
    NCSS_method_metric: Joi.array().items(Joi.string().min(1).max(256)),
    NCSS_class_metric: Joi.array().items(Joi.string().min(1).max(256)),
    NCSS_file_metric: Joi.array().items(Joi.string().min(1).max(256)),
    CYC_metric: Joi.array().items(Joi.string().min(1).max(256)),
    NPath_metric: Joi.array().items(Joi.string().min(1).max(256)),
    CDAC_metric: Joi.array().items(Joi.string().min(1).max(256)),
    CFOC_metric: Joi.array().items(Joi.string().min(1).max(256)),
    bool_expression_metric: Joi.array().items(Joi.string().min(1).max(256)),
    LOC_metric: Joi.array().items(Joi.string().min(1).max(256)),
    keywords: Joi.array().items(Joi.string().min(1).max(256)),
    rare_keywords: Joi.array().items(Joi.string().min(1).max(256)),
  }),
  custom_filters: Joi.array().items(Joi.object()),
  case_sensitive: Joi.boolean(),
  regex: Joi.boolean(),
  whole_words: Joi.boolean(),
})

export const getSearchSupplementaryData = async (
  req: IAuthRequest<{}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await searchService.getSearchSupplementaryData()
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export const searchSubmissions = async (
  req: IAuthRequest<{}, {}, ISearchCodeParams>,
  res: AuthResponse<any, ISearchCodeParams>,
  next: NextFunction
) => {
  try {
    const result = await searchService.searchSubmissions(res.locals.queryParams)
    if (result) {
      res.json(result)
    } else {
      res.status(400).json({ message: 'Bad query' })
    }
  } catch (err) {
    next(err)
  }
}

export const searchAllSubmissions = async (
  req: IAuthRequest<{}, {}, ISearchCodeParams>,
  res: AuthResponse<any, ISearchCodeParams>,
  next: NextFunction
) => {
  try {
    const result = await searchService.searchAllSubmissions(res.locals.queryParams)
    if (result) {
      res.json(result)
    } else {
      res.status(400).json({ message: 'Bad query' })
    }
  } catch (err) {
    next(err)
  }
}

export const searchAllSubmissionIds = async (
  req: IAuthRequest<{}, {}, ISearchCodeParams>,
  res: AuthResponse<any, ISearchCodeParams>,
  next: NextFunction
) => {
  try {
    const result = await searchService.searchAllSubmissionIds(res.locals.queryParams)
    if (result) {
      res.json(result)
    } else {
      res.status(400).json({ message: 'Bad query' })
    }
  } catch (err) {
    next(err)
  }
}
