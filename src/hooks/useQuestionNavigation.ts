import { loadFromLocalStorage } from 'helpers'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { Answer, LocalStorageKey, Question } from 'types/common'

interface UseQuestionNavigationProps {
  questions: Question[]
  answers: Answer[]
  startTime: number
  setStartTime: (time: number) => void
  setAnswers: Dispatch<SetStateAction<Answer[]>>
  setIsQuizCompleted: Dispatch<SetStateAction<boolean>>
}

// custom hook to manage question navigation within a quiz
export const useQuestionNavigation = ({
  questions,
  answers,
  startTime,
  setStartTime,
  setAnswers,
  setIsQuizCompleted,
}: UseQuestionNavigationProps) => {
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(
    loadFromLocalStorage<number>(LocalStorageKey.ACTIVE_QUESTION_IDX, 1)
  )

  // function to filter answers by current questions
  const filterAnswers = useCallback((currentAnswers: Answer[], currentQuestions: Question[]): Answer[] => {
    const validQuestionIds = currentQuestions.map((q) => q.id) // gather the IDs of all questions in the current list
    return currentAnswers.filter((answer) => validQuestionIds.includes(answer.questionId)) // leave only answers for existing questions
  }, [])

  // moving to the previous question
  const handlePrevQuestion = useCallback(() => {
    if (activeQuestionIdx === 1) return

    const endTime = Date.now() // capture the end time when moving to the previous question
    const spentTime = endTime - startTime // calculate time spent on the current question
    const currentQuestionId = questions[activeQuestionIdx - 1].id // get the current question id

    // find the current answer and update the time spent on it
    const currentAnswer = answers.find((answer) => answer.questionId === currentQuestionId)?.value

    // update the answers array with the new spent time for the current question
    setAnswers((prev) =>
      prev.map((item) =>
        item.questionId === currentQuestionId
          ? {
              ...item,
              spentTime:
                item.value === currentAnswer && item.spentTime ? item.spentTime : (item.spentTime || 0) + spentTime,
            }
          : item
      )
    )

    setStartTime(endTime) // update the start time for the next question
    setActiveQuestionIdx((prev) => prev - 1) // move to the previous question
  }, [activeQuestionIdx, answers, questions, startTime, setAnswers, setStartTime])

  // moving to the next question
  const handleNextQuestion = useCallback(() => {
    const endTime = Date.now() // capture the end time when moving to the next question
    const spentTime = endTime - startTime // calculate time spent on the current question
    const currentQuestionId = questions[activeQuestionIdx - 1].id // get the current question id

    // find the current answer and update the time spent on it
    const currentAnswer = answers.find((answer) => answer.questionId === currentQuestionId)?.value

    // update the answers array with the new spent time for the current question
    const updatedAnswers = answers.map((item) =>
      item.questionId === currentQuestionId
        ? {
            ...item,
            spentTime:
              item.value === currentAnswer && item.spentTime ? item.spentTime : (item.spentTime || 0) + spentTime,
          }
        : item
    )

    // filter answers by current questions
    const filteredAnswers = filterAnswers(updatedAnswers, questions)

    setAnswers(filteredAnswers)
    setStartTime(endTime)

    localStorage.setItem(LocalStorageKey.QUESTIONS, JSON.stringify(questions))
    localStorage.setItem(LocalStorageKey.ANSWERS, JSON.stringify(filteredAnswers))

    if (activeQuestionIdx === questions.length) {
      setIsQuizCompleted(true)
      localStorage.setItem(LocalStorageKey.IS_QUIZ_COMPLETED, 'true')
      return
    }

    setActiveQuestionIdx((prev) => prev + 1)
    localStorage.setItem(LocalStorageKey.ACTIVE_QUESTION_IDX, (activeQuestionIdx + 1).toString())
  }, [activeQuestionIdx, answers, questions, startTime, setAnswers, setStartTime, setIsQuizCompleted, filterAnswers])

  return {
    activeQuestionIdx,
    setActiveQuestionIdx,
    handlePrevQuestion,
    handleNextQuestion,
  }
}
