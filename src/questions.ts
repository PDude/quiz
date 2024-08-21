import { Question, QuestionType } from 'types/common'

export const questions: Question[] = [
  {
    id: 1,
    type: QuestionType.OPTION,
    question: 'What is your gender?',
    description: 'Please select the option that best describes your identity',
    display: 'tiles',
    options: [
      { value: 'male', label: 'Male', imgSrc: 'male.png' },
      { value: 'female', label: 'Female', imgSrc: 'female.png' },
    ],
    conditionalBlocks: {
      female: [
        {
          id: 2,
          question: 'Are you currently pregnant or breastfeeding?',
          description: 'Indicate if you are experiencing a period of maternal care',
          type: QuestionType.OPTION,
          options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ],
          conditionalBlocks: {
            yes: [
              {
                id: 3,
                question: 'Are you pregnant or breastfeeding for more than 6 months?',
                description:
                  'Indicate if you are currently in a condition that involves extended maternal care or feeding',
                type: QuestionType.OPTION,
                options: [
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                ],
                conditionalBlocks: {
                  no: [
                    {
                      id: 4,
                      question: 'Are you taking any medications?',
                      description: 'List all prescribed or over-the-counter drugs currently being consumed',
                      type: QuestionType.OPTION,
                      options: [
                        { value: 'yes', label: 'Yes' },
                        { value: 'no', label: 'No' },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    id: 5,
    question: 'Do you have any known allergies?',
    description: 'Please specify if certain substances cause adverse reactions for you',
    type: QuestionType.INPUT,
  },
  {
    id: 6,
    question: 'What is your current weight in kilograms?',
    description: 'Provide the numerical value that accurately reflects your body mass',
    type: QuestionType.INPUT,
    valueType: 'number',
  },
  {
    id: 7,
    question: 'What is your current height in centimeters?',
    description: 'Enter the precise measurement reflecting your stature in the metric system',
    type: QuestionType.INPUT,
    valueType: 'number',
  },
]
