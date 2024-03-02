import { baseApi } from './baseApi'

export type ParamsProductType = {
  limit: number
  offset: number
}

export type ProductType = {
  brand: null | string
  id: string
  price: number
  product: string
}

export type ProductsIdResponseType = {
  result: string[]
}

const productsApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getProducts: builder.mutation<{ result: ProductType[] }, string[]>({
        query: (ids: string[]) => ({
          body: { action: 'get_items', params: { ids } },
          method: 'POST',
          url: '/',
        }),
      }),

      getProductsId: builder.query<ProductsIdResponseType, ParamsProductType>({
        query: params => ({
          body: { action: 'get_ids', params },
          method: 'POST',
          url: '/',
        }),
      }),
    }
  },
})

export const { useGetProductsIdQuery, useGetProductsMutation } = productsApi
