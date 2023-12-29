import { useEffect, useState } from 'react';
import { IQuestionForUserType } from '../../types/questionType';
import styles from './Answer.module.scss';

interface IPropsType {
    questionData: IQuestionForUserType;
    updateAllData: (id: string, data: IQuestionForUserType) => void;
}
function Answer({ questionData, updateAllData }: IPropsType) {
    const [question, setQuestion] = useState(questionData);

    useEffect(() => {
        updateAllData(3, question);
    }, [question]);
    useEffect(() => {
        setQuestion(questionData);
    }, [questionData]);

    function updateAnswer(answer: string) {
        let newAnswer = [...question.answer];
        if (question.type === '체크박스') {
            if (newAnswer.includes(answer)) newAnswer = newAnswer.filter((val) => val !== answer);
            else newAnswer.push(answer);
        } else newAnswer = [answer];

        setQuestion((prev) => ({
            ...prev,
            answer: newAnswer,
        }));
    }
    return (
        <article className={styles.container}>
            <h3>{question.question}</h3>
            {(question.type === '객관식' || question.type === '체크박스') && (
                <ul className={styles.optionList}>
                    {question.options?.map((option) => (
                        <li
                            className={`${styles.option} ${question.answer.includes(option.id) ? styles.hit : ''}`}
                            key={option.id}
                            onClick={() => updateAnswer(option.id)}
                        >
                            <div className={styles.checkbox}></div>
                            <span>{option.title}</span>
                        </li>
                    ))}
                </ul>
            )}
        </article>
    );
}
export default Answer;
