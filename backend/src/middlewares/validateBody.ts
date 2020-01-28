import { Response, NextFunction } from 'express'
import * as Joi from 'joi'

import { ValidationError } from '../common'

import { AnyRequest } from '../types/general'

export const validateBody = (schema: Joi.ObjectSchema) => async (req: AnyRequest, res: Response, next: NextFunction) => {
  const { body } = req

  const result = Joi.validate(body, schema)

  if (result.error) {
    next(new ValidationError(result.error.message))
  } else {
    await next()
  }
}
