import { FC, memo } from 'react'

interface ButtonProps {
  onClick: () => void
  label: string
  disabled?: boolean
  className?: string
}

export const Button: FC<ButtonProps> = memo(({ onClick, label, disabled, className }) => (
  <button
    disabled={disabled}
    className={`bg-gray-700 text-white font-bold py-2 px-4 rounded hover:bg-gray-600 disabled:opacity-25 disabled:hover:bg-gray-700 ${className}`}
    onClick={onClick}
  >
    {label}
  </button>
))
