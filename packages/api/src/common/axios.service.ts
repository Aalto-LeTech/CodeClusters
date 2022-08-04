import axios, { AxiosError } from 'axios'
import { log } from './logger'

import { config } from './config'

export const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
}

/**
 * Generates requests using axios since fetch is slightly annoying.
 *
 * Incase the request throws an error, handles the most common cases eg 401 with default error
 * messages and returns undefined if the error was handled. If the error wasn't handled eg a 400 error,
 * throws it for the store to handle.
 * @param url - The path after the API_URL
 * @param options - Axios options object
 */
const createRequest = <T>(url: string, options: any) : Promise<T> => {
  return axios(url, options)
    .then(res => res.data)
    .catch((err: AxiosError) => {
      if (err.response) {
        const data = err.response.data as any
        if (config.ENV === 'local') {
          log.error('Handled axios error: ')
          log.error(JSON.stringify(data, null, 2))
        }
        if (err.response.headers['content-type'].includes('text/html')) {
          // Flask dev error message
          throw new Error(err.response.statusText)
        }
        let msg = ''
        if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
          // @ts-ignore
          msg = data?.error?.msg
        }
        throw new Error(msg || data)
      }
      throw err
    })
}

export const axiosService = {
  get: <T>(path: string, headers = defaultHeaders) => createRequest<T>(path, { headers, method: 'GET' }),
  post: <T>(path: string, data: any, headers = defaultHeaders) => createRequest<T>(path, { headers, data, method: 'POST' }),
  put: <T>(path: string, data: any, headers = defaultHeaders) => createRequest<T>(path, { headers, data, method: 'PUT' }),
  del: <T>(path: string, headers = defaultHeaders) => createRequest<T>(path, { headers, method: 'DELETE' }),
}
