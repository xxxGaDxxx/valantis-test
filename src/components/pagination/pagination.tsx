import { FC } from 'react'

import styles from './pagination.module.scss'

import { PAGE_DEFAULT } from '../../utils/constants'

type PaginationProps = {
  disabledNextPage?: boolean
  handleNextPage: () => void
  handlePrevPage: () => void
  isLoading: boolean
  page: number
}

export const Pagination: FC<PaginationProps> = ({
  disabledNextPage,
  handleNextPage,
  handlePrevPage,
  isLoading,
  page,
}) => {
  return (
    <div className={styles.pagination}>
      <button
        className={styles.btn}
        disabled={!isLoading || page === PAGE_DEFAULT}
        onClick={handlePrevPage}
      >
        Предыдущая
      </button>
      <span>Страница {page}</span>
      <button
        className={styles.btn}
        disabled={!isLoading || disabledNextPage}
        onClick={handleNextPage}
      >
        Следующая
      </button>
    </div>
  )
}
