import QuestionCategoryType from './questionCategoryType';

export default interface IQuestionType {
    id: string;
    isShow: boolean | string;
    isRequired: boolean | string;
    question: string;
    type: QuestionCategoryType;
    options:
        | {
              id: string;
              title: string;
              target: string | null;
          }[]
        | null;
    range: {
        min: string;
        max: string;
        value: string;
        step: string;
    } | null;
}
