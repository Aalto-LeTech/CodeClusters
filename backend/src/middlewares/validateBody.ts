import { Request, Response, NextFunction } from 'express'
import * as Joi from 'joi'

import { ValidationError } from '../common'

export const validateBody = (schema: Joi.ObjectSchema) => async (req: Request, res: Response, next: NextFunction) => {
  const { body } = req

  const result = Joi.validate(body, schema)

  if (result.error) {
    next(new ValidationError(result.error.message))
  } else {
    await next()
  }
}
