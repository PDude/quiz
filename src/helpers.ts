export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  const storedValue = localStorage.getItem(key)
  return storedValue ? (JSON.parse(storedValue) as T) : defaultValue
}
