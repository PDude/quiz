import { AsyncData } from 'components/core/AsyncData'
import { Button } from 'components/core/Button'
import { Card } from 'components/ui/Card'
import { ProgressBar } from 'components/core/ProgressBar'
import { QuestionBlock } from 'components/layout/QuestionBlock'
import { Text } from 'components/ui/Text'
import { formatDuration, intervalToDuration } from 'date-fns'
import { loadFromLocalStorage } from 'helpers'
import { useAnswerManagement } from 'hooks/useAnswerManagement'
import { useCanProceed } from 'hooks/useCanProceed'
import { useQuestionNavigation } from 'hooks/useQuestionNavigation'
import { questions as initialQuestions } from 'questions'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Answer, LocalStorageKey, Question, QuestionType } from 'types/common'

interface QuizProps {
  onReset: () => void
}

export const Quiz: FC<QuizProps> = ({ onReset }) => {
  // refs
  const inputRef = useRef<HTMLInputElement | null>(null)

  // state initialization
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [answers, setAnswers] = useState<Answer[]>(() => loadFromLocalStorage(LocalStorageKey.ANSWERS, []))
  const [questions, setQuestions] = useState<Question[]>(() =>
    loadFromLocalStorage<Question[]>(LocalStorageKey.QUESTIONS, [])
  )
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(() =>
    loadFromLocalStorage(LocalStorageKey.IS_QUIZ_COMPLETED, false)
  )

  // hooks
  const { handleChangeOption, handleChangeInput } = useAnswerManagement({ setAnswers, setQuestions, answers })
  const { activeQuestionIdx, setActiveQuestionIdx, handleNextQuestion, handlePrevQuestion } = useQuestionNavigation({
    questions,
    answers,
    startTime,
    setStartTime,
    setAnswers,
    setIsQuizCompleted,
  })
  const { canProceedToNextQuestion } = useCanProceed({ answers, questions, activeQuestionIdx })

  // variables
  // this variable should be calculated based on the actual fetching state,
  // but for the sake of simplicity, we'll use the length of the questions array,
  // to not complicate the logic
  const isQuestionLoading = !questions.length

  // memoized values
  const totalQuestions = useMemo(() => questions.length, [questions])
  const progressCounter = `${activeQuestionIdx}/${totalQuestions}`
  const progressPercentage = useMemo(
    () => (isQuestionLoading ? 0 : (answers.length / totalQuestions) * 100),
    [answers.length, isQuestionLoading, totalQuestions]
  )

  const totalTimeSpent = useMemo(() => {
    const total = answers.reduce((acc, { spentTime }) => acc + (spentTime || 0), 0)
    return formatDuration(intervalToDuration({ start: 0, end: total }))
  }, [answers])

  // handlers
  const isOptionSelected = useCallback(
    (value: string, questionId: number) =>
      answers.some((answer) => answer.questionId === questionId && answer.value === value),
    [answers]
  )

  const handleReset = useCallback(() => {
    onReset()
    setQuestions(initialQuestions)
    setAnswers([])
    setActiveQuestionIdx(1)
    localStorage.clear()
  }, [onReset, setActiveQuestionIdx])

  // effects
  useEffect(() => {
    const currentQuestion = questions[activeQuestionIdx - 1]
    if (currentQuestion?.type === QuestionType.INPUT) inputRef.current?.focus()
  }, [activeQuestionIdx, questions])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && canProceedToNextQuestion()) handleNextQuestion()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleNextQuestion, canProceedToNextQuestion])

  useEffect(() => setStartTime(Date.now()), [])

  // imitate questions fetching
  useEffect(() => {
    if (questions.length) return
    const timer = setTimeout(() => {
      setQuestions(initialQuestions)
      localStorage.setItem(LocalStorageKey.QUESTIONS, JSON.stringify(initialQuestions))
    }, 0)

    return () => clearTimeout(timer)
  }, [questions])

  return (
    <Card>
      {!isQuizCompleted && (
        <div className="flex justify-between items-center gap-5">
          <button onClick={handlePrevQuestion} disabled={activeQuestionIdx === 1} className="disabled:opacity-25">
            back
          </button>

          <AsyncData
            isLoading={isQuestionLoading}
            isEmpty={!questions.length}
            emptyElement={null}
            loadingElement={null}
            dataElement={<Text label={progressCounter} type="plain" />}
          />
        </div>
      )}

      {!isQuizCompleted && <ProgressBar progress={progressPercentage} />}

      {!isQuizCompleted && (
        <AsyncData
          isLoading={isQuestionLoading}
          isEmpty={!questions.length}
          emptyElement={<Text label="No questions provided" type="body" />}
          loadingElement={<Text label="Loading..." type="body" />}
          dataElement={questions.map((question, idx) => {
            if (idx + 1 !== activeQuestionIdx) return null

            const currentAnswer = answers.find((a) => a.questionId === question.id)

            return (
              <QuestionBlock
                key={question.id}
                question={question}
                answer={currentAnswer}
                handleChangeInput={handleChangeInput}
                handleChangeOption={handleChangeOption}
                isOptionSelected={isOptionSelected}
                inputRef={inputRef}
              />
            )
          })}
        />
      )}

      {!isQuizCompleted && (
        <Button
          onClick={handleNextQuestion}
          label="NEXT"
          disabled={!canProceedToNextQuestion() || isQuestionLoading}
          className="mt-auto"
        />
      )}

      {isQuizCompleted && (
        <div className="flex flex-col gap-3 flex-1">
          <Text label="You are all set" type="subtitle" />
          <Text label={`Total time spent: ${totalTimeSpent}`} type="plain" />
          <Button onClick={handleReset} label="RESET" className="mt-auto" />
        </div>
      )}
    </Card>
  )
}
