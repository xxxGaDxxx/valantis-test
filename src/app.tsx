import React, { useEffect, useState } from 'react'

import { ProductType, useGetProductsIdQuery, useGetProductsMutation } from './services/products'
import { DEFAULT_LIMIT_AND_OFFSET } from './utils/constants'
import { filterUniqueById } from './utils/filterUniqueById'

export const App: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(false)

  const {
    data: productsIdResult,
    error: errorProductsId,
    refetch,
  } = useGetProductsIdQuery({
    limit: DEFAULT_LIMIT_AND_OFFSET,
    offset: 0,
  })

  const [getProducts, { error: errorProducts }] = useGetProductsMutation()

  const fetchProductsData = async () => {
    if (productsIdResult && 'result' in productsIdResult) {
      const productsData = await getProducts(productsIdResult.result)

      if (productsData && 'data' in productsData) {
        setProducts(filterUniqueById(productsData.data.result))
      }

      setLoading(true)
    }
  }

  useEffect(() => {
    if (errorProductsId && 'status' in errorProductsId && errorProductsId?.status) {
      console.error('Ошибка при загрузке id товаров:', errorProductsId?.data)
      refetch()
    }
    if (errorProducts && 'status' in errorProducts && errorProducts?.status) {
      console.error('Ошибка при загрузке товаров:', errorProducts?.data)
      fetchProductsData()
    }
  }, [errorProductsId, errorProducts])

  useEffect(() => {
    fetchProductsData()
  }, [productsIdResult])

  if (!loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Список товаров</h1>
      {products.map(product => (
        <div key={product.id}>
          <p>ID: {product.id}</p>
          <p>Название: {product.product}</p>
          <p>Цена: {product.price}</p>
          <p>Бренд: {product?.brand || '-'}</p>
        </div>
      ))}
    </div>
  )
}
