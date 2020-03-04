import { Response, NextFunction } from 'express'
import * as Joi from 'joi'

import { ValidationError } from '../common'

import { AnyRequest } from '../types/general'

export const parseQueryParams = (schema: Joi.ObjectSchema) => (req: AnyRequest, res: Response, next: NextFunction) => {
  const { query } = req

  const result = Joi.validate(query, schema)

  if (result.error) {
    next(new ValidationError(result.error.message))
  } else {
    const mutatedReq = req as AnyRequest
    mutatedReq.queryParams = result.value
    next()
  }
}
