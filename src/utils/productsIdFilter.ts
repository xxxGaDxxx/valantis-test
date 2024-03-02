import { DEFAULT_LIMIT_AND_OFFSET, PAGE_DEFAULT } from './constants'

export const productsIdOffsetFilter = (page: number, productsId: string[]) =>
  productsId.filter((_, index) => {
    if (page === PAGE_DEFAULT) {
      return index < page * DEFAULT_LIMIT_AND_OFFSET
    }

    return (
      index >= page * DEFAULT_LIMIT_AND_OFFSET - DEFAULT_LIMIT_AND_OFFSET &&
      index < page * DEFAULT_LIMIT_AND_OFFSET
    )
  })
