import { FC, useEffect, useRef } from 'react'

import styles from './product-table.module.scss'

import { ProductType } from '../../services/products'
import { Loader } from '../loader/loader'

type ProductCardsProps = {
  isLoading: boolean
  products: ProductType[]
}

export const ProductTable: FC<ProductCardsProps> = ({ isLoading, products }) => {
  const firstRowRef = useRef<HTMLTableRowElement>(null)

  useEffect(() => {
    if (products.length > 0 && firstRowRef.current) {
      firstRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [products])

  return (
    <div className={styles.wrapper}>
      {!isLoading && <Loader />}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>№</th>
            <th>Название</th>
            <th>Цена</th>
            <th>ID</th>
            <th>Бренд</th>
          </tr>
        </thead>
        <tbody className={`${!isLoading && styles.loading} ${products.length && styles.scroll}`}>
          {Boolean(products.length) && (
            <>
              {products.map((product, index) => {
                return (
                  <tr key={product.id} ref={index === 0 ? firstRowRef : null}>
                    <td>{index + 1}</td>
                    <td>{product.product}</td>
                    <td>{product.price}</td>
                    <td>{product.id}</td>
                    <td>{product.brand || '-'}</td>
                  </tr>
                )
              })}
            </>
          )}

          {isLoading && !products.length && (
            <tr>
              <td className={styles.noContent} colSpan={4}>
                Нет товаров
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
