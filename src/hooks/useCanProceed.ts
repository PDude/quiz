// Import necessary hooks and types from React and the application's type definitions.
import { useCallback } from 'react'
import { Answer, Question, QuestionType } from 'types/common'

interface UseCanProceedProps {
  answers: Answer[]
  questions: Question[]
  activeQuestionIdx: number
}

// custom hook to determine if the user can proceed to the next question based on their answers.
export const useCanProceed = ({ answers, questions, activeQuestionIdx }: UseCanProceedProps) => {
  const canProceedToNextQuestion = useCallback(() => {
    // get the current question based on the activeQuestionIdx.
    const currentQuestion = questions[activeQuestionIdx - 1]

    // check if the current question is of type OPTION
    if (currentQuestion?.type === QuestionType.OPTION) {
      // return true if there's at least one answer matching the current question's id
      return answers.some((answer) => answer.questionId === currentQuestion.id)
    }

    // check if the current question is of type INPUT
    if (currentQuestion?.type === QuestionType.INPUT) {
      // find the answer for the current question and check if it's not empty or just whitespace.
      const inputAnswer = answers.find((answer) => answer.questionId === currentQuestion.id)?.value
      return !!inputAnswer && inputAnswer.toString().trim() !== ''
    }

    // for any other question type, allow proceeding by default.
    return true
  }, [activeQuestionIdx, answers, questions])

  return { canProceedToNextQuestion }
}
