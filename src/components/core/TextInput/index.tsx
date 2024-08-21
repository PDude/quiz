import { forwardRef, LegacyRef, memo } from 'react'

interface TextInputProps {
  value: string | number
  onValueChange: (value: string) => void
  type?: 'text' | 'number'
}

export const TextInput = memo(
  forwardRef<HTMLInputElement, TextInputProps>(
    ({ value, onValueChange, type = 'text' }, ref: LegacyRef<HTMLInputElement>) => {
      return (
        <input
          ref={ref}
          type={type}
          value={value || ''}
          onChange={(e) => onValueChange(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
      )
    }
  )
)
