import QuestionCategoryType from './questionCategoryType';

export default interface IQuestionType {
    id: string;
    isShow: boolean | string;
    isRequired: boolean | string;
    question: string;
    type: QuestionCategoryType;
    options:
        | {
              title: string;
              target: string | null;
          }[]
        | null;
}
