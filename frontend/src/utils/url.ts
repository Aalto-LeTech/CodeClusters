import queryString from 'query-string'
import Joi from '@hapi/joi'

import { ISearchCodeParams } from 'shared'

const FACET_PARAMS = Joi.object({
  start: Joi.number().integer().required(),
  end: Joi.number().integer().required(),
  gab: Joi.number().integer().required(),
})

const searchParamsSchema = Joi.object({
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
    symbolic_names_tokens: Joi.alternatives().try(Joi.boolean(), FACET_PARAMS),
    rare_symbolic_names_tokens: Joi.alternatives().try(Joi.boolean(), FACET_PARAMS),
    rules_tokens: Joi.alternatives().try(Joi.boolean(), FACET_PARAMS),
  }),
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
  }, {} as any)
}

export function createSearchQueryParams(obj: {[key: string]: any}) {
  const pruned = removeEmptyValues(obj)
  const { q, ...rest } = pruned
  if (q === undefined) return ''
  if (rest['facets']) {
    rest['facets'] = JSON.stringify(rest['facets'])
  }
  const encoded = queryString.stringify(rest)
  return `?q=${q}&${encoded}`
}

export function parseSearchQueryParams(url: string) {
  const parsed = queryString.parse(url, { arrayFormat: 'comma' })
  if (parsed.custom_filters && typeof parsed.custom_filters === 'string') {
    parsed.custom_filters = [parsed.custom_filters]
  } else if (parsed.facets && typeof parsed.facets === 'string') {
    parsed.facets = JSON.parse(parsed.facets)
  }
  const { error, value: values } = searchParamsSchema.validate(parsed, {
    abortEarly: false
  })
  // console.log(error?.details)
  return values as unknown as ISearchCodeParams
}
