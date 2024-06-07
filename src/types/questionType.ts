import QuestionCategoryType from './questionCategoryType';

export interface IQuestionType {
    answer: string[];
    id: string;
    isRequired: boolean;
    isShow: boolean;
    optionList:
        | null
        | {
              id: string;
              title: string;
              target: string[];
          }[];
    question: string;
    rangeValue: null | {
        id: string;
        min: string;
        max: string;
        value: string;
        step: string;
    };
    type: 'LONG' | 'SHORT' | 'MULTIPLE' | 'CHECK' | 'RANGE';
}

export interface IQuestionForUserType extends IQuestionType {
    answer: string[];
}
