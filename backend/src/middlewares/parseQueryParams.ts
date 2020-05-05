import { Response, NextFunction } from 'express'
import { ObjectSchema } from '@hapi/joi'

import { ValidationError } from '../common'

import { AnyRequest } from '../types/request'

export const parseQueryParams = (schema: ObjectSchema) => (req: AnyRequest, res: Response, next: NextFunction) => {
  const { query } = req

  const result = schema.validate(query)

  if (result.error) {
    next(new ValidationError(result.error.message))
  } else {
    const mutatedReq = req as AnyRequest
    mutatedReq.queryParams = result.value
    next()
  }
}
