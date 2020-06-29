import queryString from 'query-string'
import Joi from '@hapi/joi'

import { ISearchCodeParams } from 'shared'

const searchParamsSchema = Joi.object({
  q: Joi.string().min(1).max(256).required(),
  course_id: Joi.number().integer(),
  exercise_id: Joi.number().integer(),
  student_ids: Joi.array().items(Joi.number().integer()),
  num_results: Joi.number().integer(),
  num_lines: Joi.number().integer(),
  results_start: Joi.number().integer(),
  custom_filters: Joi.array().items(Joi.string()),
  case_sensitive: Joi.boolean(),
  regex: Joi.boolean(),
  whole_words: Joi.boolean(),
})

export function removeEmptyValues(obj: {[key: string]: any}) {
  return Object.keys(obj).reduce((acc, key) => {
    if (!obj[key] || obj[key] === '' || obj[key].length === 0) {
      return acc
    }
    return { ...acc, [key]: obj[key] }
  }, {})
}

export function createSearchQueryParams(obj: {[key: string]: any}) {
  const pruned = removeEmptyValues(obj)
  const keys = Object.keys(pruned)
  if (keys.includes('q')) {
    return keys.reduce((acc, cur, i) => cur !== 'q' ? `${acc}&${cur}=${pruned[cur]}` : acc, `?q=${pruned['q']}`)
  }
  return ''
}

export function parseSearchQueryParams(url: string) {
  const parsed = queryString.parse(url, { arrayFormat: 'comma' })
  if (parsed.custom_filters && typeof parsed.custom_filters === 'string') {
    parsed.custom_filters = [parsed.custom_filters]
  }
  const { error, value: values } = searchParamsSchema.validate(parsed, {
    abortEarly: false
  })
  // console.log(error?.details)
  // console.log(values)
  return values as unknown as ISearchCodeParams
}
