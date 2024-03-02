import { useEffect, useState } from 'react'

const DEFAULT_DELAY = 1000

type UseDebounceProps<T> = {
  delay?: number
  value: T
}

export const useDebounce = <T extends unknown>({
  delay = DEFAULT_DELAY,
  value,
}: UseDebounceProps<T>) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
