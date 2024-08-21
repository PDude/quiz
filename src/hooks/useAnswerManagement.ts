import { Dispatch, SetStateAction, useCallback } from 'react'
import { Answer, Question } from 'types/common'

interface UseAnswerManagementProps {
  setAnswers: Dispatch<SetStateAction<Answer[]>>
  setQuestions: Dispatch<SetStateAction<Question[]>>
  answers: Answer[]
}

// custom hook for managing answers and questions in a dynamic quiz
export const useAnswerManagement = ({ setAnswers, setQuestions, answers }: UseAnswerManagementProps) => {
  // handles option changes
  const handleChangeOption = useCallback(
    (value: string | number, questionId: number) => {
      // update answers state with the new or updated answer.
      setAnswers((prev) =>
        prev.some((item) => item.questionId === questionId)
          ? prev.map((item) => (item.questionId === questionId ? { questionId, value, spentTime: 0 } : item))
          : [...prev, { questionId, value, spentTime: 0 }]
      )

      // update questions state based on the selected option.
      setQuestions((prev) => {
        // recursive function to find and add conditional questions based on the selected answer.
        const findQuestionsToAdd = (
          conditionalBlocks: Record<string, Question[]>,
          value: string | number
        ): Question[] => {
          const nextQuestions = conditionalBlocks?.[value]
          if (!nextQuestions?.length) return []

          let allQuestions: Question[] = []

          nextQuestions.forEach((question) => {
            allQuestions.push(question)

            // if the question has conditional blocks and has been answered, add nested questions.
            if (question.conditionalBlocks && answers.some((answer) => answer.questionId === question.id)) {
              const userAnswerValue = answers.find((answer) => answer.questionId === question.id)?.value
              const nestedQuestions = findQuestionsToAdd(question.conditionalBlocks, userAnswerValue || '')
              allQuestions = [...allQuestions, ...nestedQuestions]
            }
          })

          return allQuestions
        }

        const currentQuestion = prev?.find((item) => item.id === questionId)

        // if the current question doesn't have conditional blocks, return the current state.
        if (!currentQuestion?.conditionalBlocks) return prev

        // find next questions based on the current answer.
        const nextQuestions = findQuestionsToAdd(currentQuestion.conditionalBlocks, value)

        // filter out questions that are no longer relevant based on the new answer.
        const otherAnswerQuestions = Object.values(currentQuestion.conditionalBlocks)
          .flat()
          .map((question) => question.id)

        let updatedQuestions = prev.filter((question) => !otherAnswerQuestions.includes(question.id))

        // insert the next questions into the questions array at the correct position.
        if (nextQuestions.length) {
          const questionIdx = updatedQuestions.findIndex((question) => question.id === questionId)
          updatedQuestions = [
            ...updatedQuestions.slice(0, questionIdx + 1),
            ...nextQuestions,
            ...updatedQuestions.slice(questionIdx + 1),
          ]
        }

        return updatedQuestions
      })
    },
    [answers, setAnswers, setQuestions]
  )

  // handles input changes
  const handleChangeInput = useCallback(
    (value: string, questionId: number) => {
      // update answers state with the new or updated answer.
      setAnswers((prev) => {
        if (value.trim() === '') {
          // remove the answer if the input is cleared.
          return prev.filter((item) => item.questionId !== questionId)
        }

        // update or add the answer based on whether it already exists.
        return prev.some((item) => item.questionId === questionId)
          ? prev.map((item) => (item.questionId === questionId ? { ...item, value, spentTime: 0 } : item))
          : [...prev, { questionId, value, spentTime: 0 }]
      })
    },
    [setAnswers]
  )

  return {
    handleChangeOption,
    handleChangeInput,
  }
}
