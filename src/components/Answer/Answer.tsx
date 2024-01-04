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
        updateAllData(question.id, question);
    }, [question]);

    function updateAnswer(answer: string) {
        setQuestion((prev) => {
            let newAnswer = [...question.answer];
            if (question.type === '객관식') {
                if (newAnswer[0] === answer) newAnswer = [];
                else newAnswer = [answer];
            } else if (question.type === '체크박스') {
                if (newAnswer.includes(answer)) newAnswer = newAnswer.filter((val) => val !== answer);
                else newAnswer.push(answer);
            } else if (question.type === '단답형' || question.type === '장문형' || question.type === '범위') {
                newAnswer = [answer];
            }
            return { ...prev, answer: newAnswer };
        });
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
            {(question.type === '단답형' || question.type === '장문형') && (
                <div className={styles.sentenceAnswerWrap}>
                    {question.type === '단답형' && (
                        <input value={question.answer[0] || ''} onChange={(e) => updateAnswer(e.currentTarget.value)} />
                    )}
                    {question.type === '장문형' && (
                        <textarea
                            value={question.answer[0] || ''}
                            onChange={(e) => updateAnswer(e.currentTarget.value)}
                        />
                    )}
                </div>
            )}
            {question.type === '범위' && (
                <div className={styles.rangeAnswerWrap}>
                    <input
                        type='range'
                        min={question.range?.min}
                        max={question.range?.max}
                        step={question.range?.step}
                        value={question.answer}
                        onChange={(e) => updateAnswer(e.currentTarget.value)}
                    />
                    <span>{question.answer}</span>
                </div>
            )}
        </article>
    );
}
export default Answer;
