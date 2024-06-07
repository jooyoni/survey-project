import { useParams } from 'react-router-dom';
import styles from './ResultDetail.module.scss';
import { useEffect, useState } from 'react';
import { IQuestionForUserType } from '../../types/questionType';
function ResultDetail() {
    const { surveyId = '' } = useParams();
    const { answerId = '' } = useParams();
    const [questions, setQuestions] = useState<IQuestionForUserType[]>([]);

    useEffect(() => {
        let db = JSON.parse(localStorage.getItem('surveys') || '{}');
        setQuestions(db[surveyId].results[answerId]);
        console.log(db[surveyId].results[answerId]);
    }, []);

    return (
        <main className={styles.container}>
            <ul className={styles.questionList}>
                {questions.map((question) => (
                    <li key={question.id}>
                        <h3>{question.question}</h3>

                        {(question.type === 'CHECK' ||
                            question.type === 'MULTIPLE') &&
                            question.optionList && (
                                <ul>
                                    {question.optionList?.map((option) => (
                                        <li
                                            key={option.id}
                                            className={
                                                question.answer.includes(
                                                    option.id
                                                )
                                                    ? styles.hit
                                                    : ''
                                            }
                                        >
                                            {option.title}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        {(question.type === 'SHORT' ||
                            question.type === 'LONG' ||
                            question.type === 'RANGE') && (
                            <div>{question.answer[0]}</div>
                        )}
                    </li>
                ))}
            </ul>
        </main>
    );
}
export default ResultDetail;
