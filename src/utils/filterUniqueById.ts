import { ProductType } from '../services/products'

export const filterUniqueById = (inputArray: ProductType[]) => {
  const uniqueIds: Record<string, boolean> = {}
  const uniqueArray: ProductType[] = []

  inputArray.forEach(item => {
    if (!uniqueIds[item.id]) {
      uniqueIds[item.id] = true
      uniqueArray.push(item)
    }
  })

  return uniqueArray
}
