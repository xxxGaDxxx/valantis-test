import React, { useEffect, useState } from 'react'

import styles from './app.module.scss'

import { FiltersInputs } from './components/filters-inputs/filters-inputs'
import { Pagination } from './components/pagination/pagination'
import { ProductTable } from './components/product-table/product-table'
import {
  ProductType,
  useFilterProductsMutation,
  useGetProductsIdQuery,
  useGetProductsMutation,
} from './services/products'
import { DEFAULT_LIMIT_AND_OFFSET, PAGE_DEFAULT } from './utils/constants'
import { filterUniqueById } from './utils/filterUniqueById'
import { productsIdOffsetFilter } from './utils/productsIdFilter'

export const App: React.FC = () => {
  const [loading, setLoading] = useState(false)

  const [products, setProducts] = useState<ProductType[]>([])
  const [productsIdFilter, setProductsIdFilter] = useState<string[]>([])

  const [isSearchProduct, setIsSearchProduct] = useState(false)

  const [page, setPage] = useState(PAGE_DEFAULT)

  const {
    data: productsIdResult,
    error: errorProductsId,
    refetch,
  } = useGetProductsIdQuery(
    {
      limit: DEFAULT_LIMIT_AND_OFFSET,
      offset: (page - PAGE_DEFAULT) * DEFAULT_LIMIT_AND_OFFSET || 0,
    },
    { skip: isSearchProduct }
  )

  const [getProducts, { error: errorProducts }] = useGetProductsMutation()
  const [filterProducts, { error: errorFilterProducts }] = useFilterProductsMutation()

  const fetchProductsData = async () => {
    setLoading(false)

    if (!productsIdResult?.result && !productsIdFilter) {
      setLoading(true)

      return
    }

    const uniqueIds = new Set<string>()

    if (isSearchProduct) {
      if (productsIdFilter.length) {
        const productsFilterPage = productsIdOffsetFilter(page, productsIdFilter)

        productsFilterPage.forEach((id: string) => uniqueIds.add(id))
      }
    }

    if (productsIdResult && 'result' in productsIdResult && !isSearchProduct) {
      productsIdResult.result.forEach((id: string) => uniqueIds.add(id))
    }

    if (uniqueIds.size) {
      const productsData = await getProducts(Array.from(uniqueIds))

      if (productsData && 'data' in productsData) {
        setProducts(filterUniqueById(productsData.data.result))
      }
    }
    if (productsIdResult && 'result' in productsIdResult && productsIdResult.result.length) {
      setLoading(true)
    }
  }

  const handleSearch = async (field: string, value: number | string) => {
    setLoading(false)
    setPage(PAGE_DEFAULT)
    const filterProductsIdData = await filterProducts({ [field]: value })

    if ('error' in filterProductsIdData && filterProductsIdData.error) {
      setTimeout(() => {
        handleSearch(field, value)
      }, 1000)

      return
    }

    if ('data' in filterProductsIdData) {
      if (!filterProductsIdData?.data?.result.length) {
        setProducts([])
        setProductsIdFilter([])
        if (!isSearchProduct) {
          refetch()

          return
        }
        setLoading(true)

        return
      }

      setProductsIdFilter(filterProductsIdData?.data?.result)
    }
  }

  const handleRefetch = () => {
    setPage(PAGE_DEFAULT)
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

  const isDisabledNextPage = Boolean(
    isSearchProduct && page >= productsIdFilter.length / DEFAULT_LIMIT_AND_OFFSET
  )

  useEffect(() => {
    if (errorProductsId && 'status' in errorProductsId && errorProductsId?.status) {
      setLoading(false)
      console.error('Ошибка при загрузке id товаров:', errorProductsId?.data)
      refetch()
      setTimeout(() => {
        refetch()
      }, 1000)
    }
    if (errorProducts && 'status' in errorProducts && errorProducts?.status) {
      setLoading(false)
      console.error('Ошибка при загрузке товаров:', errorProducts?.data)

      setTimeout(() => {
        fetchProductsData()
      }, 1000)
    }
    if (errorFilterProducts && 'status' in errorFilterProducts && errorFilterProducts?.status) {
      setLoading(false)
      console.error('Ошибка при загрузке отфильтрованного товара:', errorFilterProducts?.data)
      setTimeout(() => {
        fetchProductsData()
      }, 1000)
    }
  }, [errorProductsId, errorProducts, errorFilterProducts])

  useEffect(() => {
    if (isSearchProduct && page > PAGE_DEFAULT && productsIdFilter) {
      fetchProductsData()
    }
  }, [page])

  useEffect(() => {
    fetchProductsData()
  }, [productsIdResult, productsIdFilter, isSearchProduct])

  return (
    <div className={styles.wrapper}>
      <h1>Список товаров</h1>
      <FiltersInputs
        handleSearch={handleSearch}
        isLoading={loading}
        refetch={handleRefetch}
        setIsSearchProduct={setIsSearchProduct}
      />
      <ProductTable isLoading={loading} products={products} />
      <Pagination
        disabledNextPage={isDisabledNextPage}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        isLoading={loading}
        page={page}
      />
    </div>
  )
}
