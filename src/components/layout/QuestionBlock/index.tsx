import { OptionInput } from 'components/core/OptionInput'
import { TextInput } from 'components/core/TextInput'
import { Text } from 'components/ui/Text'
import { FC, memo, RefObject, useCallback } from 'react'
import { Answer, Question, QuestionType } from 'types/common'

interface QuestionBlockProps {
  question: Question
  answer: Answer | undefined
  handleChangeInput: (value: string, questionId: number) => void
  inputRef: RefObject<HTMLInputElement>
  handleChangeOption: (value: string | number, questionId: number) => void
  isOptionSelected: (value: string, questionId: number) => boolean
}

export const QuestionBlock: FC<QuestionBlockProps> = memo(
  ({ question, answer, handleChangeInput, inputRef, handleChangeOption, isOptionSelected }) => {
    const onInputChange = useCallback(
      (value: string) => handleChangeInput(value, question.id),
      [handleChangeInput, question.id]
    )

    const optionsDisplayType = question.display === 'tiles' ? 'grid grid-cols-2' : 'flex flex-col'

    return (
      <div className="flex gap-3 flex-col">
        <Text label={question.question} type="subtitle" />
        <Text label={question.description} type="plain" />

        {question.type === QuestionType.INPUT && (
          <TextInput
            value={answer?.value || ''}
            type={question.valueType}
            onValueChange={onInputChange}
            ref={inputRef}
          />
        )}

        {question.type === QuestionType.OPTION && !!question.options && (
          <div className={`${optionsDisplayType} gap-2`}>
            {question.options.map(({ label, value, imgSrc }) => (
              <OptionInput
                key={value}
                label={label}
                value={value}
                imgSrc={imgSrc}
                questionId={question.id}
                isSelected={isOptionSelected(value, question.id)}
                onValueChange={handleChangeOption}
              />
            ))}
          </div>
        )}
      </div>
    )
  }
)
