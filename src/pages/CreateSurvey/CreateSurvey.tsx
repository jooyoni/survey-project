import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Question from '../../components/Question/Question';
import styles from './CreateSurvey.module.scss';
import { useEffect, useState } from 'react';
import IQuestionType from '../../types/questionType';
import { v4 as uuidv4 } from 'uuid';

function CreateSurvey() {
    const [questionData, setQuestionData] = useState<IQuestionType[]>([]);
    useEffect(() => {
        setQuestionData([
            {
                id: uuidv4(),
                isShow: false,
                isRequired: true,
                question: '',
                type: '객관식',
                options: [
                    {
                        title: '답변 1',
                        target: null,
                    },
                ],
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
    return (
        <main className={styles.container}>
            <div className={styles.contentWrap}>
                <div className={styles.questionListWrap}>
                    <DragDropContext onDragEnd={(e) => console.log(e)}>
                        <Droppable droppableId={'questions'}>
                            {(provided) => (
                                <ul
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={styles.questionList}
                                >
                                    {questionData.map((data, idx) => (
                                        <Draggable
                                            draggableId={String(idx)}
                                            key={idx}
                                            index={idx}
                                        >
                                            {(provided) => (
                                                <li
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                >
                                                    <Question
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
                </div>
                <article className={styles.stickyToolWrap}></article>
            </div>
        </main>
    );
}
export default CreateSurvey;
