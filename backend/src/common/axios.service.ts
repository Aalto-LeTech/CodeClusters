import axios, { AxiosError } from 'axios'

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
        if (config.ENV === 'development') {
          console.error(err.response.data.stack)
        }
        throw new Error(err.response.data.message || err.response.data)
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
