export enum LocalStorageKey {
  QUESTIONS = 'questions',
  ANSWERS = 'answers',
  ACTIVE_QUESTION_IDX = 'activeQuestionIdx',
  IS_QUIZ_STARTED = 'isQuizStarted',
  IS_QUIZ_COMPLETED = 'isQuizCompleted',
}

export enum QuestionType {
  OPTION = 'option',
  INPUT = 'input',
}

export interface Option {
  value: string
  label: string
  imgSrc?: string
}

export interface Question {
  id: number
  question: string
  description: string
  type: QuestionType
  options?: Option[]
  display?: 'list' | 'tiles'
  valueType?: 'text' | 'number'
  conditionalBlocks?: Record<string, Question[]>
}

export interface Answer {
  questionId: number
  value: string | number
  spentTime: number
}
