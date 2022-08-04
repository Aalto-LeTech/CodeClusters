import queryString from 'query-string'
import Joi from 'joi'

import { ISearchCodeParams } from '@codeclusters/types'

const FACET_PARAMS = Joi.object({
  start: Joi.number().integer().required(),
  end: Joi.number().integer().required(),
  gap: Joi.number().integer().required(),
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
    symbolic_names_tokens: Joi.array().items(Joi.string().min(1).max(256)),
    rare_symbolic_names_tokens: Joi.array().items(Joi.string().min(1).max(256)),
    rules_tokens: Joi.array().items(Joi.string().min(1).max(256)),
  }),
  custom_filters: Joi.array().items(Joi.string()),
  case_sensitive: Joi.boolean(),
  regex: Joi.boolean(),
  whole_words: Joi.boolean(),
})

export function removeEmptyValues(obj: { [key: string]: any }) {
  return Object.keys(obj).reduce((acc, key) => {
    const val = obj[key]
    if (!val || val === '' || val.length === 0) {
      return acc
    } else if (typeof val === 'object' && Object.keys(val).length === 0) {
      return acc
    }
    return { ...acc, [key]: val }
  }, {} as any)
}

export function createSearchQueryParams(obj: { [key: string]: any }) {
  const pruned = removeEmptyValues(obj)
  const { q, ...rest } = pruned
  if (q === undefined) return ''
  if (rest['facets']) {
    rest['facets'] = JSON.stringify(rest['facets'])
  }
  if (rest['facet_filters']) {
    rest['facet_filters'] = JSON.stringify(rest['facet_filters'])
  }
  const encoded = queryString.stringify(rest)
  return `?q=${q}&${encoded}`
}

// Discard values that the JSON parse failed to transform into an object (causes bugs later)
function parseAndAddJSONKey(obj: Object, key: string) {
  if (obj[key] && typeof obj[key] === 'string') {
    const result = JSON.parse(obj[key])
    if (typeof result === 'string') {
      delete obj[key]
    } else {
      obj[key] = result
    }
  }
}

export function parseSearchQueryParams(url: string) {
  const parsed = queryString.parse(url, { arrayFormat: 'comma' })
  if (parsed.custom_filters && typeof parsed.custom_filters === 'string') {
    parsed.custom_filters = [parsed.custom_filters]
  }
  parseAndAddJSONKey(parsed, 'facets')
  parseAndAddJSONKey(parsed, 'facet_filters')
  const { error, value: values } = searchParamsSchema.validate(parsed, {
    abortEarly: false,
  })
  if (!error) {
    return values as unknown as ISearchCodeParams
  }
  return undefined
}
