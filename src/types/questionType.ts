import QuestionCategoryType from './questionCategoryType';

export interface IQuestionType {
  id: string;
  isShow: (boolean | string)[];
  isRequired: (boolean | string)[];
  question: string;
  type: QuestionCategoryType;
  options:
    | {
        id: string;
        title: string;
        target: string[];
      }[]
    | null;
  range: {
    id: string;
    min: string;
    max: string;
    value: string;
    step: string;
  } | null;
}

export interface IQuestionForUserType extends IQuestionType {
  answer: string[];
}
