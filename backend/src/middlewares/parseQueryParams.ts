import { Response, NextFunction } from 'express'
import { ObjectSchema } from '@hapi/joi'

import { ValidationError } from '../common'

import { AnyRequest } from '../types/request'

export const parseQueryParams = (schema: ObjectSchema) => (req: AnyRequest, res: Response, next: NextFunction) => {
  const { query } = req
  let parsed
  // Parse JSON objects from query params (used with facets eg facets={"NCSS_method_metric":true})
  // Since there wasn't really any other reasonable way (other than changing to POST requests which would have made the use of
  // copy-pastable search URLs impossible)
  try {
    parsed = Object.keys(query).reduce((acc, cur) => {
      const val = query[cur]
      if (typeof val === 'string' && val.charAt(0) === '{' && val.charAt(val.length - 1) === '}') {
        acc[cur] = JSON.parse(val as string)
      } else {
        acc[cur] = val
      }
      return acc
    }, {} as { [key: string]: any })
  } catch (err) {
    next(new ValidationError('Invalid JSON object in query parameters'))
  }

  const result = schema.validate(parsed)

  if (result.error) {
    next(new ValidationError(result.error.message))
  } else {
    const mutatedReq = req as AnyRequest
    mutatedReq.queryParams = result.value
    next()
  }
}
