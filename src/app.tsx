import React, { useEffect, useState } from 'react'

import styles from './app.module.scss'

import { ProductTable } from './components/product-table/product-table'
import { ProductType, useGetProductsIdQuery, useGetProductsMutation } from './services/products'
import { DEFAULT_LIMIT_AND_OFFSET } from './utils/constants'
import { filterUniqueById } from './utils/filterUniqueById'

export const App: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(false)

  const {
    data: productsIdResult,
    error: errorProductsId,
    isLoading,
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
      setLoading(true)
      console.error('Ошибка при загрузке id товаров:', errorProductsId?.data)
      refetch()
    }
    if (errorProducts && 'status' in errorProducts && errorProducts?.status) {
      setLoading(true)
      console.error('Ошибка при загрузке товаров:', errorProducts?.data)
      fetchProductsData()
    }
  }, [errorProductsId, errorProducts])

  useEffect(() => {
    fetchProductsData()
  }, [productsIdResult])

  return (
    <div className={styles.wrapper}>
      <h1>Список товаров</h1>
      <ProductTable isLoading={loading || isLoading} products={products} />
    </div>
  )
}
