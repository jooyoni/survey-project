import { useEffect, useState } from 'react';
import { IQuestionForUserType } from '../../types/questionType';
import styles from './Answer.module.scss';

interface IPropsType {
    questionData: IQuestionForUserType;
    // updateAllData: (id: string, data: IQuestionForUserType) => void;
}
function Answer({ questionData }: IPropsType) {
    const [question, setQuestion] = useState<any>(questionData);

    // useEffect(() => {
    //     updateAllData(question.id, question);
    // }, [question]);

    function updateAnswer(answer: string) {
        setQuestion((prev: any) => {
            let newAnswer = [...question.answer];
            if (question.type === 'CHECK') {
                if (newAnswer[0] === answer) newAnswer = [];
                else newAnswer = [answer];
            } else if (question.type === 'MULTIPLE') {
                if (newAnswer.includes(answer))
                    newAnswer = newAnswer.filter((val) => val !== answer);
                else newAnswer.push(answer);
            } else if (
                question.type === 'SHORT' ||
                question.type === 'LONG' ||
                question.type === 'RANGE'
            ) {
                newAnswer = [answer];
            }
            return { ...prev, answer: newAnswer };
        });
    }

    return (
        <article className={styles.container}>
            <h3>{question.question}</h3>
            {(question.type === 'CHECK' || question.type === 'MULTIPLE') && (
                <ul className={styles.optionList}>
                    {question.options?.map((option: any) => (
                        <li
                            className={`${styles.option} ${
                                question.answer.includes(option.id)
                                    ? styles.hit
                                    : ''
                            }`}
                            key={option.id}
                            onClick={() => updateAnswer(option.id)}
                        >
                            <div className={styles.checkbox}></div>
                            <span>{option.title}</span>
                        </li>
                    ))}
                </ul>
            )}
            {(question.type === 'SHORT' || question.type === 'LONG') && (
                <div className={styles.sentenceAnswerWrap}>
                    {question.type === 'SHORT' && (
                        <input
                            value={question.answer[0] || ''}
                            onChange={(e) =>
                                updateAnswer(e.currentTarget.value)
                            }
                        />
                    )}
                    {question.type === 'LONG' && (
                        <textarea
                            value={question.answer[0] || ''}
                            onChange={(e) =>
                                updateAnswer(e.currentTarget.value)
                            }
                        />
                    )}
                </div>
            )}
            {question.type === 'RANGE' && (
                <div className={styles.rangeAnswerWrap}>
                    <input
                        type='range'
                        min={question.rangeValue?.min}
                        max={question.rangeValue?.max}
                        step={question.rangeValue?.step}
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
