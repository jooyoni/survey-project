import {
    DragDropContext,
    Draggable,
    DraggableProvidedDragHandleProps,
    DropResult,
    Droppable,
} from 'react-beautiful-dnd';
import styles from './Question.module.scss';
import { IQuestionType } from '../../types/questionType';
import { useEffect, useState } from 'react';
import QUESTION_TYPE_LIST from '../../constants/questionTypeList';
import MultipleChoiceMark from '../MultipleChoiceMark/MultipleChoiceMark';
import { v4 as uuidv4 } from 'uuid';

interface IPropsType {
    allQuestion: IQuestionType[];
    isActive: boolean;
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
    data: IQuestionType;
    questionIndex: number;
    updateQuestion: (idx: number, data: IQuestionType) => void;
    deleteQuestion: (idx: number) => void;
}
function Question({
    allQuestion,
    isActive,
    dragHandleProps,
    data,
    questionIndex,
    updateQuestion,
    deleteQuestion,
}: IPropsType) {
    const [question, setQuestion] = useState(data);

    //현재 컴포넌트의 질문데이터를 질문리스트 데이터에 동기화
    useEffect(() => {
        updateQuestion(questionIndex, question);
    }, [question]);
    //현재 컴포넌트의 질문데이터를 질문리스트 데이터에 동기화

    // 질문 타입에 따른 값 수정
    useEffect(() => {
        if (question.type === 'CHECK' || question.type === 'MULTIPLE')
            setQuestion((prev) => ({
                ...prev,
                optionList: [
                    {
                        id: uuidv4(),
                        title: '옵션 1',
                        target: [],
                    },
                ],
                rangeValue: null,
            }));
        else if (question.type === 'RANGE') {
            setQuestion((prev) => ({
                ...prev,
                optionList: null,
                rangeValue: {
                    id: uuidv4(),
                    min: '0',
                    max: '10',
                    value: '5',
                    step: '1',
                },
            }));
        } else
            setQuestion((prev) => ({
                ...prev,
                optionList: null,
                rangeValue: null,
            }));
    }, [question.type]);
    // 질문 타입에 따른 값 수정

    const [typeSelectOpen, setTypeSelectOpen] = useState(false);

    function addOption() {
        const optionList = question.optionList ? question.optionList : [];
        const optionLength = optionList.length;
        setQuestion((prev) => ({
            ...prev,
            optionList: [
                ...optionList,
                {
                    id: uuidv4(),
                    title: `옵션 ${optionLength + 1}`,
                    target: [],
                },
            ],
        }));
    }

    function sortOption(dropResult: DropResult) {
        if (!question.optionList || !dropResult.destination) return;
        let optionList = [...question.optionList];
        let changedOptionIdx: number;
        optionList.forEach((option, idx) => {
            if (option.id === dropResult.draggableId) changedOptionIdx = idx;
        });
        let changedOption = optionList.splice(changedOptionIdx!, 1)[0];
        optionList.splice(dropResult.destination?.index, 0, changedOption!);
        setQuestion((prev) => ({
            ...prev,
            optionList: optionList,
        }));
    }
    function removeOption(id: string) {
        let optionList = question.optionList ? question.optionList : [];
        if (optionList.length <= 1) return;
        optionList = optionList.filter((option) => option.id !== id);
        setQuestion((prev) => ({
            ...prev,
            optionList,
        }));
    }
    function updateOption(idx: number, value: string) {
        let optionList = question.optionList ? question.optionList : [];
        optionList[idx].title = value;
        setQuestion((prev) => ({
            ...prev,
            optionList,
        }));
    }

    function updateRange(key: 'min' | 'max' | 'value' | 'step', value: string) {
        if (
            (isNaN(Number(value + '0')) && isNaN(Number(value))) ||
            !question.rangeValue
        )
            return;
        setQuestion((prev) => ({
            ...prev,
            rangeValue: {
                ...question.rangeValue!,
                [key]: value,
            },
        }));
    }
    function updateOptionTarget(optionIndex: number, questionId: string) {
        let newOptionList = question.optionList;
        if (!newOptionList) return;
        if (!newOptionList[optionIndex].target.includes(questionId))
            newOptionList[optionIndex].target.push(questionId);
        else
            newOptionList[optionIndex].target = newOptionList[
                optionIndex
            ].target.filter((id) => id !== questionId);
        setQuestion((prev) => ({
            ...prev,
            optionList: newOptionList,
        }));
    }

    function handleRequire() {
        setQuestion((prev) => ({
            ...prev,
            isRequired: !prev.isRequired,
        }));
    }

    function handleShow() {
        setQuestion((prev) => ({
            ...prev,
            isShow: !prev.isShow,
        }));
    }

    const [optionTargetOpenIdx, setOptionTargetOpenIdx] = useState(-1);
    return (
        <article
            onClick={() => console.log(questionIndex)}
            className={`${styles.container} ${isActive ? styles.hit : ''}`}
        >
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
                        onBlur={() => setTypeSelectOpen(false)}
                        tabIndex={1}
                    >
                        <span>{question.type}</span>
                        {typeSelectOpen && (
                            <ul className={styles.typeList}>
                                {QUESTION_TYPE_LIST.map((type) => (
                                    <li
                                        key={type}
                                        onClick={() =>
                                            setQuestion((prev) => ({
                                                ...prev,
                                                type,
                                            }))
                                        }
                                    >
                                        {type}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                {/* CHECK, MULTIPLE */}
                {(question.type === 'CHECK' ||
                    question.type === 'MULTIPLE') && (
                    <DragDropContext
                        onDragEnd={(dropResult) => sortOption(dropResult)}
                    >
                        <Droppable droppableId={'optionList'}>
                            {(provided) => (
                                <ul
                                    className={styles.optionList}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {question.optionList?.map((option, idx) => (
                                        <Draggable
                                            draggableId={option.id}
                                            key={option.id}
                                            index={idx}
                                        >
                                            {(provided) => (
                                                <li
                                                    key={option.id}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={styles.option}
                                                >
                                                    <div
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <MultipleChoiceMark
                                                            isCircle={
                                                                question.type ===
                                                                'CHECK'
                                                            }
                                                        />
                                                    </div>
                                                    <input
                                                        value={option?.title}
                                                        onChange={(e) =>
                                                            updateOption(
                                                                idx,
                                                                e.currentTarget
                                                                    .value
                                                            )
                                                        }
                                                    ></input>
                                                    <div
                                                        className={`${
                                                            styles.targetSelectArea
                                                        } ${
                                                            optionTargetOpenIdx ===
                                                            idx
                                                                ? styles.open
                                                                : ''
                                                        }`}
                                                        onClick={() =>
                                                            setOptionTargetOpenIdx(
                                                                (prev) =>
                                                                    prev === idx
                                                                        ? -1
                                                                        : idx
                                                            )
                                                        }
                                                        tabIndex={1}
                                                        onBlur={() =>
                                                            setOptionTargetOpenIdx(
                                                                -1
                                                            )
                                                        }
                                                    >
                                                        <span>
                                                            {(() => {
                                                                let questions =
                                                                    allQuestion;
                                                                let target =
                                                                    questions.filter(
                                                                        (
                                                                            question
                                                                        ) => {
                                                                            return option.target.includes(
                                                                                question.id
                                                                            );
                                                                        }
                                                                    );
                                                                if (
                                                                    target.length ===
                                                                    0
                                                                )
                                                                    return '해당 옵션 선택시 활성화';
                                                                else
                                                                    return target
                                                                        .map(
                                                                            (
                                                                                question
                                                                            ) =>
                                                                                question.question
                                                                        )
                                                                        .join(
                                                                            ', '
                                                                        );
                                                            })()}
                                                        </span>
                                                        {optionTargetOpenIdx ===
                                                            idx && (
                                                            <ul
                                                                className={
                                                                    styles.targetList
                                                                }
                                                            >
                                                                {(() => {
                                                                    let list = [
                                                                        ...allQuestion,
                                                                    ];
                                                                    list.splice(
                                                                        questionIndex,
                                                                        1
                                                                    );
                                                                    return list.map(
                                                                        (q) => (
                                                                            <li
                                                                                className={
                                                                                    option.target.includes(
                                                                                        q.id
                                                                                    )
                                                                                        ? styles.hit
                                                                                        : ''
                                                                                }
                                                                                key={
                                                                                    question.id
                                                                                }
                                                                                onClick={() =>
                                                                                    updateOptionTarget(
                                                                                        idx,
                                                                                        q.id
                                                                                    )
                                                                                }
                                                                            >
                                                                                {
                                                                                    q.question
                                                                                }
                                                                            </li>
                                                                        )
                                                                    );
                                                                })()}
                                                            </ul>
                                                        )}
                                                    </div>
                                                    <button
                                                        className={
                                                            styles.removeOptionBtn
                                                        }
                                                        onClick={() =>
                                                            removeOption(
                                                                option.id
                                                            )
                                                        }
                                                    >
                                                        <svg
                                                            xmlns='http://www.w3.org/2000/svg'
                                                            width='24'
                                                            height='24'
                                                            viewBox='0 0 24 24'
                                                        >
                                                            <path
                                                                fill='#5f6368'
                                                                d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
                                                            ></path>
                                                            <path
                                                                d='M0 0h24v24H0z'
                                                                fill='none'
                                                            ></path>
                                                        </svg>
                                                    </button>
                                                </li>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}

                                    <li onClick={addOption}>
                                        <span>옵션추가</span>
                                    </li>
                                </ul>
                            )}
                        </Droppable>
                    </DragDropContext>
                )}
                {/* CHECK, MULTIPLE */}

                {/* SHORT, LONG */}
                {(question.type === 'SHORT' || question.type === 'LONG') && (
                    <div className={styles.sentenceAnswerWrap}>
                        {question.type === 'SHORT' && (
                            <input
                                type='text'
                                placeholder='SHORT 텍스트'
                                disabled
                            />
                        )}
                        {question.type === 'LONG' && (
                            <textarea
                                placeholder='LONG 텍스트'
                                disabled
                            ></textarea>
                        )}
                    </div>
                )}
                {/* SHORT, LONG */}

                {question.type === 'RANGE' && (
                    <div className={styles.rangeAnswerWrap}>
                        <ul className={styles.valueList}>
                            <li>
                                <label htmlFor='min'>최솟값</label>
                                <input
                                    type='text'
                                    id='min'
                                    value={question.rangeValue?.min}
                                    onChange={(e) =>
                                        updateRange(
                                            'min',
                                            e.currentTarget.value
                                        )
                                    }
                                />
                            </li>
                            <li>
                                <label htmlFor='max'>최대값</label>
                                <input
                                    type='text'
                                    id='max'
                                    value={question.rangeValue?.max}
                                    onChange={(e) =>
                                        updateRange(
                                            'max',
                                            e.currentTarget.value
                                        )
                                    }
                                />
                            </li>
                            <li>
                                <label htmlFor='step'>간격</label>
                                <input
                                    type='text'
                                    id='step'
                                    value={question.rangeValue?.step}
                                    onChange={(e) =>
                                        updateRange(
                                            'step',
                                            e.currentTarget.value
                                        )
                                    }
                                />
                            </li>
                        </ul>
                        <div className={styles.example}>
                            <input
                                type='range'
                                min={question.rangeValue?.min}
                                max={question.rangeValue?.max}
                                value={question.rangeValue?.value}
                                step={question.rangeValue?.step}
                                onChange={(e) =>
                                    updateRange('value', e.currentTarget.value)
                                }
                            />
                            <span>{question.rangeValue?.value}</span>
                        </div>
                    </div>
                )}
            </form>
            <ul className={styles.questionControlBtn}>
                <li className={styles.delete}>
                    <button onClick={() => deleteQuestion(questionIndex)}>
                        delete
                    </button>
                </li>
                <li
                    className={`${styles.required} ${
                        question.isRequired ? styles.active : ''
                    }`}
                >
                    <span>필수</span>
                    <button onClick={handleRequire}>
                        <div></div>
                    </button>
                </li>
                <li
                    className={`${styles.show} ${
                        !question.isShow ? styles.active : ''
                    }`}
                >
                    <span>숨킴</span>
                    <button onClick={handleShow}>
                        <div></div>
                    </button>
                </li>
            </ul>
        </article>
    );
}
export default Question;
