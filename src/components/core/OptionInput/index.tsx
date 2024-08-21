import { Text } from 'components/ui/Text'
import { FC, memo } from 'react'

interface OptionInputProps {
  label: string
  value: string | number
  imgSrc?: string
  questionId: number
  isSelected: boolean
  onValueChange: (value: string | number, questionId: number) => void
}

export const OptionInput: FC<OptionInputProps> = memo(
  ({ label, value, questionId, isSelected, onValueChange, imgSrc }) => (
    <label
      className="flex flex-col gap-4 bg-gray-700 py-2 px-4 rounded hover:bg-gray-600 cursor-pointer"
      htmlFor={`${questionId}-${value}`}
    >
      {imgSrc && <img src={`src/assets/${imgSrc}`} alt={label} className="w-14 m-auto" />}

      <div className="flex items-center gap-2">
        <input
          type="radio"
          id={`${questionId}-${value}`}
          value={value}
          checked={isSelected}
          name={`question-${questionId}`}
          onChange={() => onValueChange(value, questionId)}
        />

        <Text label={label} type="body" />
      </div>
    </label>
  )
)
