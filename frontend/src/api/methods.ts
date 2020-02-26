import axios, { AxiosError } from 'axios'

import { stores } from '../index'

const { NODE_ENV, REACT_APP_API_URL } = process.env
export const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
}
export const authenticatedHeaders = () => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${stores.authStore.jwt.token}`
})

/**
 * Generates requests using axios since fetch is slightly annoying.
 *
 * Incase the request throws an error, handles the most common cases eg 401 with default error
 * messages and returns undefined if the error was handled. If the error wasn't handled eg a 400 error,
 * throws it for the store to handle.
 * @param path - The path after the API_URL
 * @param options - Axios options object
 */
const createRequest = <T>(path: string, options: any) : Promise<Maybe<T>> => {
  return axios(`${REACT_APP_API_URL}/${path}`, options)
    .then(res => res.data)
    .catch((err: AxiosError) => {
      if (err.response) {
        if (NODE_ENV === 'development') {
          stores.toastStore!.createToast(err.response.data.message, 'info', 10000)
          console.error(err.response.data.stack)
        }
        switch (err.response.status) {
          case 401:
            if (options.headers && options.headers.Authorization) {
              stores.toastStore!.createToast('401 Your session has expired, please re-login.', 'error')
              return undefined
            }
            break
          case 403:
            stores.toastStore!.createToast('403 You do not have privileges for that action', 'error')
            return undefined
          case 404:
            stores.toastStore!.createToast('404 Route not found', 'error')
            return undefined
          case 502:
          case 503:
          case 504:
            stores.toastStore!.createToast(`${err.response.status} The backend is unreachable`, 'error')
            return undefined
          case 500:
            stores.toastStore!.createToast('500 The backend had a bug, whops', 'error')
            return undefined
        }
        throw new Error(err.response.data.message || err.response.data)
      }
      throw err
    })
}

type Maybe<T> = T | undefined

export const get = <T>(path: string, headers = defaultHeaders) =>
  createRequest<T>(path, { headers, method: 'GET' })

export const getWithQuery = <T>(path: string, params: any, headers = defaultHeaders) =>
  createRequest<T>(path, { headers, params, method: 'GET' })

export const post = <T>(path: string, data: any, headers = defaultHeaders) =>
  createRequest<T>(path, { headers, data, method: 'POST' })

export const put = <T>(path: string, data: any, headers = defaultHeaders) =>
  createRequest<T>(path, { headers, data, method: 'PUT' })

export const del = <T>(path: string, headers = defaultHeaders) =>
  createRequest<T>(path, { headers, method: 'DELETE' })
