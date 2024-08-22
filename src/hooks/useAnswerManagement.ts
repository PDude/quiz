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
      // update answers state with the new or updated answer
      setAnswers((prev) =>
        prev.some((item) => item.questionId === questionId)
          ? prev.map((item) => (item.questionId === questionId ? { questionId, value, spentTime: 0 } : item))
          : [...prev, { questionId, value, spentTime: 0 }]
      )

      // update the questions list based on the selected answer
      setQuestions((prev) => {
        // recursive function to find questions to add
        const findQuestionsToAdd = (
          conditionalBlocks: Record<string, Question[]>,
          value: string | number
        ): Question[] => {
          const nextQuestions = conditionalBlocks?.[value]
          if (!nextQuestions?.length) return []

          let allQuestions: Question[] = []

          nextQuestions.forEach((question) => {
            allQuestions.push(question)

            // if the question has conditional blocks and it has already been answered, add the nested questions
            if (question.conditionalBlocks && answers.some((answer) => answer.questionId === question.id)) {
              const userAnswerValue = answers.find((answer) => answer.questionId === question.id)?.value
              const nestedQuestions = findQuestionsToAdd(question.conditionalBlocks, userAnswerValue || '')
              allQuestions = [...allQuestions, ...nestedQuestions]
            }
          })

          return allQuestions
        }

        // recursive function to remove questions that are no longer relevant
        const removeNestedQuestions = (
          conditionalBlocks: Record<string, Question[]>,
          currentQuestions: Question[]
        ): Question[] => {
          const allIdsToRemove: number[] = Object.values(conditionalBlocks)
            .flat()
            .map((question) => question.id)

          // recursive function to remove all nested questions
          Object.values(conditionalBlocks).forEach((questions) => {
            questions.forEach((question) => {
              if (question.conditionalBlocks) {
                currentQuestions = removeNestedQuestions(question.conditionalBlocks, currentQuestions)
              }
            })
          })

          // return the updated list of questions without the ones to remove
          return currentQuestions.filter((question) => !allIdsToRemove.includes(question.id))
        }

        const currentQuestion = prev?.find((item) => item.id === questionId)

        // if the current question has no conditional blocks, return the current list of questions
        if (!currentQuestion?.conditionalBlocks) return prev

        // delete all old questions that are no longer relevant
        let updatedQuestions = removeNestedQuestions(currentQuestion.conditionalBlocks, prev)

        // find new questions to add based on the current answer
        const nextQuestions = findQuestionsToAdd(currentQuestion.conditionalBlocks, value)

        // insert the next questions in the correct position
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
