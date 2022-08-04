import Joi from 'joi'
import merge from 'lodash.merge'

export const joiResolver =
  (schema: Joi.AnySchema) => (data: Object, validationContext?: object) => {
    const { error, value: values } = schema.validate(data, {
      abortEarly: false,
    })
    function createError(message: string, path: string[]): Object {
      if (path.length > 1) {
        return {
          [path[0]]: createError(message, path.slice(1)),
        }
      }
      return {
        [path[0]]: { message },
      }
    }
    const errors =
      error?.details.reduce(
        (acc, currentError) =>
          merge(
            acc,
            createError(
              currentError.message,
              currentError.path.map((p) => p.toString())
            )
          ),
        {}
      ) || {}

    return {
      values,
      errors,
    }
  }
