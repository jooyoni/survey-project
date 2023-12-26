import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import styles from './Question.module.scss';
import IQuestionType from '../../types/questionType';
import { useEffect, useState } from 'react';
import QUESTION_TYPE_LIST from '../../constants/questionTypeList';

interface IPropsType {
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
    data: IQuestionType;
    idx: number;
    handleUpdateQuestion: (idx: number, data: IQuestionType) => void;
}
function Question({
    dragHandleProps,
    data,
    idx,
    handleUpdateQuestion,
}: IPropsType) {
    const [question, setQuestion] = useState(data);
    useEffect(() => {
        handleUpdateQuestion(idx, question);
    }, [question]);

    const [typeSelectOpen, setTypeSelectOpen] = useState(false);

    return (
        <article className={styles.container}>
            <div className={styles.draggableArea} {...dragHandleProps}></div>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className={styles.questionDetail}>
                    <input
                        type='text'
                        value={question.question}
                        onChange={(e) => {
                            const question = e.currentTarget.value;
                            setQuestion((prev) => ({
                                ...prev,
                                question: question,
                            }));
                        }}
                    />
                    <div
                        className={`${styles.typeSelectWrap} ${
                            typeSelectOpen ? styles.open : ''
                        }`}
                        onClick={() => setTypeSelectOpen((prev) => !prev)}
                    >
                        <span>{question.type}</span>
                        {typeSelectOpen && (
                            <ul className={styles.typeList}>
                                {QUESTION_TYPE_LIST.map((type) => (
                                    <li key={type}>{type}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                {idx}
            </form>
        </article>
    );
}
export default Question;
