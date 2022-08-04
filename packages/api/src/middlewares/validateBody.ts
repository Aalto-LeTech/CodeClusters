import { Response, NextFunction } from 'express'
import { ObjectSchema } from 'joi'

import { ValidationError } from '../common'

import { AnyRequest } from '../types/request'

export const validateBody = (schema: ObjectSchema) => async (req: AnyRequest, res: Response, next: NextFunction) => {
  const { body } = req

  const result = schema.strict().validate(body)

  if (result.error) {
    next(new ValidationError(result.error.message))
  } else {
    await next()
  }
}
