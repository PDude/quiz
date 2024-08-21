import { FC, memo, ReactNode } from 'react'

export interface AsyncDataProps {
  isLoading?: boolean
  isEmpty: boolean
  emptyElement: ReactNode
  loadingElement: ReactNode
  dataElement: ReactNode
}

export const AsyncData: FC<AsyncDataProps> = memo(
  ({ isLoading, isEmpty, emptyElement, loadingElement, dataElement }) => {
    return isEmpty && isLoading ? loadingElement : isEmpty && !isLoading ? emptyElement : dataElement
  }
)
