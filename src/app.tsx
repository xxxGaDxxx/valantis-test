import React, { useEffect, useState } from 'react'

import styles from './app.module.scss'

import { Pagination } from './components/pagination/pagination'
import { ProductTable } from './components/product-table/product-table'
import { ProductType, useGetProductsIdQuery, useGetProductsMutation } from './services/products'
import { DEFAULT_LIMIT_AND_OFFSET, PAGE_DEFAULT } from './utils/constants'
import { filterUniqueById } from './utils/filterUniqueById'

export const App: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(PAGE_DEFAULT)

  const {
    data: productsIdResult,
    error: errorProductsId,
    isLoading,
    refetch,
  } = useGetProductsIdQuery({
    limit: DEFAULT_LIMIT_AND_OFFSET,
    offset: (page - PAGE_DEFAULT) * DEFAULT_LIMIT_AND_OFFSET || 0,
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

  const handleNextPage = () => {
    setPage(prev => ++prev)
    setLoading(false)
  }

  const handlePrevPage = () => {
    if (page > PAGE_DEFAULT) {
      setPage(prev => prev - PAGE_DEFAULT)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (errorProductsId && 'status' in errorProductsId && errorProductsId?.status) {
      setLoading(false)
      console.error('Ошибка при загрузке id товаров:', errorProductsId?.data)
      refetch()
    }
    if (errorProducts && 'status' in errorProducts && errorProducts?.status) {
      setLoading(false)
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
      <Pagination
        disabledNextPage={!products.length}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        isLoading={loading || isLoading}
        page={page}
      />
    </div>
  )
}
