import { FC, ReactNode } from 'react'

interface CardProps {
  children: ReactNode
}

export const Card: FC<CardProps> = ({ children }) => (
  <div className="max-w-md p-6 border rounded-lg shadow bg-gray-800 border-gray-700 w-full flex flex-col gap-8 h-max min-h-96">
    {children}
  </div>
)
