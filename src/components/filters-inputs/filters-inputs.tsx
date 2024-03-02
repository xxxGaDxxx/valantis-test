import { ChangeEvent, FC, useEffect, useState } from 'react'

import styles from './filters-inputs.module.scss'

import { useDebounce } from '../../hooks/useDebounce'
import { SearchInput } from './search-input/search-input'

type FiltersInputsProps = {
  handleSearch: (field: string, value: number | string) => void
  isLoading: boolean
  refetch: () => void
  setIsSearchProduct: (isSearch: boolean) => void
}

export const FiltersInputs: FC<FiltersInputsProps> = ({
  handleSearch,
  isLoading,
  refetch,
  setIsSearchProduct,
}) => {
  const [searchBrand, setSearchBrand] = useState('')
  const [searchPrice, setSearchPrice] = useState('')
  const [searchProduct, setSearchProduct] = useState('')

  const debounceSearchBrand = useDebounce({ value: searchBrand }).trim()
  const debounceSearchPrice = useDebounce({ value: searchPrice }).trim()
  const debounceSearchProduct = useDebounce({ value: searchProduct }).trim()
  const handleChangePrice = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')

    searchProduct.length && setSearchProduct('')
    searchBrand.length && setSearchBrand('')

    setSearchPrice(value)
  }
  const handleChangeBrand = (e: ChangeEvent<HTMLInputElement>) => {
    searchPrice.length && setSearchPrice('')
    searchProduct.length && setSearchProduct('')
    setSearchBrand(e.target.value)
  }
  const handleChangeProduct = (e: ChangeEvent<HTMLInputElement>) => {
    searchPrice.length && setSearchPrice('')
    searchProduct.length && setSearchBrand('')
    setSearchProduct(e.target.value)
  }

  const handleOnSearch = () => {
    setIsSearchProduct(true)

    if (searchBrand.trim()) {
      handleSearch('brand', debounceSearchBrand)

      return
    }
    if (searchProduct.trim()) {
      handleSearch('product', debounceSearchProduct)

      return
    }
    if (searchPrice.trim()) {
      handleSearch('price', Number(debounceSearchPrice))

      return
    }
  }

  useEffect(() => {
    if (!searchBrand && !searchPrice && !searchProduct) {
      refetch()
      setIsSearchProduct(false)

      return
    }

    if (debounceSearchBrand || debounceSearchPrice || debounceSearchProduct) {
      handleOnSearch()
    }
  }, [debounceSearchBrand, debounceSearchPrice, debounceSearchProduct])

  return (
    <div className={styles.wrapper}>
      <SearchInput
        disabled={!isLoading}
        onChange={handleChangeBrand}
        placeholder={'Бренд'}
        titleInput={'Поиск по бренду'}
        value={searchBrand}
      />
      <SearchInput
        disabled={!isLoading}
        onChange={handleChangePrice}
        placeholder={'Цена'}
        titleInput={'Поиск по цене'}
        type={'text'}
        value={searchPrice}
      />
      <SearchInput
        disabled={!isLoading}
        onChange={handleChangeProduct}
        placeholder={'Продукт'}
        titleInput={'Поиск по продукту'}
        value={searchProduct}
      />
    </div>
  )
}
