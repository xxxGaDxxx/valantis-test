import { FC, HTMLProps } from 'react'

import styles from './search-input.module.scss'

type SearchInputProps = {
  titleInput?: string
} & HTMLProps<HTMLInputElement>

export const SearchInput: FC<SearchInputProps> = ({ titleInput, ...props }) => {
  return (
    <div className={styles.wrapper}>
      <span>{titleInput}</span>
      <input type={'text'} {...props} className={styles.input} />
    </div>
  )
}
