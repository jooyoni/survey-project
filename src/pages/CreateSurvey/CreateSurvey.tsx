import {
    DragDropContext,
    Draggable,
    DropResult,
    Droppable,
} from 'react-beautiful-dnd';
import Question from '../../components/Question/Question';
import styles from './CreateSurvey.module.scss';
import { useEffect, useState } from 'react';
import IQuestionType from '../../types/questionType';
import { v4 as uuidv4 } from 'uuid';

function CreateSurvey() {
    const [questionData, setQuestionData] = useState<IQuestionType[]>([]);
    const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
    useEffect(() => {
        setQuestionData([
            {
                id: uuidv4(),
                isShow: false,
                isRequired: true,
                question: '',
                type: '객관식',
                options: null,
                range: null,
            },
        ]);
    }, []);

    function handleUpdateQuestion(idx: number, data: IQuestionType) {
        setQuestionData((prev) => {
            const newData = [...prev];
            newData[idx] = data;
            return newData;
        });
    }

    function sortQuestion(dropResult: DropResult) {
        if (!dropResult.destination) return;
        let questionList = [...questionData];
        let changedQuestionIdx: number;
        questionList.forEach((question, idx) => {
            if (question.id === dropResult.draggableId)
                changedQuestionIdx = idx;
        });
        let changedQuestion = questionList.splice(changedQuestionIdx!, 1)[0];
        questionList.splice(dropResult.destination?.index, 0, changedQuestion!);
        setQuestionData(questionList);
    }

    function addQuestion() {
        setQuestionData((prev) => {
            let newData = [...prev];
            newData.splice(activeQuestionIdx + 1, 0, {
                id: uuidv4(),
                isShow: false,
                isRequired: true,
                question: '',
                type: '객관식',
                options: null,
                range: null,
            });
            return newData;
        });
        setActiveQuestionIdx((prev) => prev + 1);
    }
    return (
        <main className={styles.container}>
            <div className={styles.contentWrap}>
                <div className={styles.questionListWrap}>
                    <DragDropContext
                        onDragEnd={(dropResult) => sortQuestion(dropResult)}
                    >
                        <Droppable droppableId={'questions'}>
                            {(provided) => (
                                <ul
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={styles.questionList}
                                >
                                    {questionData.map((data, idx) => (
                                        <Draggable
                                            draggableId={data.id}
                                            key={data.id}
                                            index={idx}
                                        >
                                            {(provided) => (
                                                <li
                                                    tabIndex={1}
                                                    onFocus={() =>
                                                        setActiveQuestionIdx(
                                                            idx
                                                        )
                                                    }
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                >
                                                    <Question
                                                        isActive={
                                                            activeQuestionIdx ===
                                                            idx
                                                        }
                                                        dragHandleProps={
                                                            provided.dragHandleProps
                                                        }
                                                        data={data}
                                                        idx={idx}
                                                        handleUpdateQuestion={
                                                            handleUpdateQuestion
                                                        }
                                                    />
                                                </li>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </ul>
                            )}
                        </Droppable>
                    </DragDropContext>
                    <button className={styles.submitBtn}>설문 생성</button>
                </div>
                <article className={styles.stickyToolWrap}>
                    <ul>
                        <li>
                            <button onClick={addQuestion}>+</button>
                        </li>
                    </ul>
                </article>
            </div>
        </main>
    );
}
export default CreateSurvey;
