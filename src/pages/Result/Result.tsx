import { useNavigate, useParams } from 'react-router-dom';
import styles from './Result.module.scss';
import { useEffect, useState } from 'react';
import { IQuestionForUserType, IQuestionType } from '../../types/questionType';

function Result() {
    const navigate = useNavigate();
    const { id: surveyId = '' } = useParams();
    const [results, setResults] = useState<{
        [key: string]: IQuestionForUserType[];
    }>({});
    const [questions, setQuestions] = useState<IQuestionType[]>([]);

    useEffect(() => {
        let db = JSON.parse(localStorage.getItem('surveys') || '{}');
        setQuestions(db[surveyId || ''].questionData);
        setResults(db[surveyId || ''].results);
    }, []);
    console.log(questions, results);
    return (
        <main className={styles.container}>
            <ul className={styles.questionList}>
                {questions.map((question) => {
                    let total = Object.keys(results).reduce((sum, key) => {
                        let qst = results[key].filter((answer) => answer.id === question.id)[0];
                        if (qst?.isShow?.length) return sum + 1;
                        else return sum;
                    }, 0);
                    return (
                        <li key={question.id}>
                            <h3>
                                {question.question} 총 답변 수 : {total}
                            </h3>
                            {(question.type === '객관식' || question.type === '체크박스') && (
                                <ul className={styles.optionList}>
                                    {question.options?.map((option) => {
                                        let value = Object.keys(results).reduce((sum, key) => {
                                            let qst = results[key].filter((answer) => answer.id === question.id)[0];
                                            if (qst?.answer?.includes(option.id)) return sum + 1;
                                            else return sum;
                                        }, 0);
                                        return (
                                            <li key={option.id}>
                                                <span>{option.title}</span>
                                                <span>{value}</span>
                                                <div
                                                    className={styles.bg}
                                                    style={{
                                                        width: `${(value / total) * 100}%`,
                                                        backgroundColor: `rgba(100,100,100,${value / total})`,
                                                    }}
                                                ></div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                            {(question.type === '단답형' || question.type === '장문형' || question.type === '범위') && (
                                <ul className={styles.sentenceAnswerWrap}>
                                    {Object.keys(results).map((key) =>
                                        results[key]
                                            .filter((answer) => answer.id === question.id)
                                            .map((answer) => <li key={answer.id}>{answer.answer[0]}</li>)
                                    )}
                                </ul>
                            )}
                        </li>
                    );
                })}
            </ul>
            <ul className={styles.resultList}>
                {Object.keys(results).map((key) => {
                    // const KEY = Object.keys(data)[0];
                    // const question = data[KEY];
                    return (
                        <li key={key} onClick={() => navigate(`/result/${surveyId}/${key}`)}>
                            {key}
                        </li>
                    );
                })}
            </ul>
        </main>
    );
}
export default Result;
