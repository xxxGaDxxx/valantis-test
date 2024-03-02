import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import { createApi } from '@reduxjs/toolkit/query/react'
import md5 from 'md5'

import { timestamp } from '../utils/timestamp'

const password = 'Valantis'
const BASE_URL = 'http://api.valantis.store:40000/'

export const customFetchBase = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: () => {
    const newHeaders = new Headers()

    newHeaders.set('Content-Type', 'application/json')
    newHeaders.set('X-Auth', md5(`${password}_${timestamp}`))

    return newHeaders
  },
})

export const baseApi = createApi({
  baseQuery: customFetchBase,
  endpoints: () => ({}),
})
