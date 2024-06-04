import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd';
import Question from '../../components/Question/Question';
import styles from './CreateSurvey.module.scss';
import { useEffect, useState } from 'react';
import { IQuestionType } from '../../types/questionType';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

function CreateSurvey() {
  const navigate = useNavigate();
  const [surveyTitle, setSurveyTitle] = useState('');
  const [questionData, setQuestionData] = useState<IQuestionType[]>([]);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  useEffect(() => {
    setQuestionData([
      {
        id: uuidv4(),
        isShow: [true],
        isRequired: [true],
        question: '',
        type: '객관식',
        options: null,
        range: null,
      },
    ]);
  }, []);

  function updateQuestion(idx: number, data: IQuestionType) {
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
      if (question.id === dropResult.draggableId) changedQuestionIdx = idx;
    });
    let changedQuestion = questionList.splice(changedQuestionIdx!, 1)[0];
    questionList.splice(dropResult.destination?.index, 0, changedQuestion!);
    setQuestionData(questionList);
    setActiveQuestionIdx(dropResult.destination?.index);
  }
  function deleteQuestion(idx: number) {
    setQuestionData((prev) => {
      let newData = [...prev];
      newData.splice(idx, 1);
      return newData;
    });
  }

  function addQuestion() {
    setQuestionData((prev) => {
      let newData = [...prev];
      newData.splice(activeQuestionIdx + 1, 0, {
        id: uuidv4(),
        isShow: [true],
        isRequired: [true],
        question: '',
        type: '객관식',
        options: null,
        range: null,
      });
      return newData;
    });
    setActiveQuestionIdx((prev) => prev + 1);
  }

  function saveSurvey() {
    if (!surveyTitle) {
      alert('설문 제목을 입력하세요.');
      return;
    } else if (!surveyCode) {
      alert('설문 유형을 선택하세요.');
      return;
    }
    const data = JSON.parse(localStorage.getItem('surveys') || '{}');
    localStorage.setItem(
      'surveys',
      JSON.stringify({ ...data, [uuidv4()]: { title: surveyTitle, questionData, results: {}, surveyCode } })
    );
    navigate('/');
  }

  const [surveyCode, setSurveyCode] = useState('');
  return (
    <main className={styles.container}>
      <div className={styles.contentWrap}>
        <div className={styles.questionWrap}>
          <div className={styles.questionTitle}>
            <input
              type='text'
              placeholder='설문 제목'
              value={surveyTitle}
              onChange={(e) => setSurveyTitle(e.currentTarget.value)}
            />
          </div>
          <select onChange={(e) => setSurveyCode(e.currentTarget.value)}>
            <option value=''></option>
            <option value='공통'>공통</option>
            <option value='내과'>내과</option>
            <option value='외과'>외과</option>
          </select>
          <DragDropContext onDragEnd={(dropResult) => sortQuestion(dropResult)}>
            <Droppable droppableId={'questions'}>
              {(provided) => (
                <ul ref={provided.innerRef} {...provided.droppableProps} className={styles.questionList}>
                  {questionData.map((data, idx) => (
                    <Draggable draggableId={data.id} key={data.id} index={idx}>
                      {(provided) => (
                        <li
                          tabIndex={1}
                          onFocus={() => setActiveQuestionIdx(idx)}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          {idx + 1}.
                          <Question
                            allQuestion={questionData}
                            isActive={activeQuestionIdx === idx}
                            dragHandleProps={provided.dragHandleProps}
                            data={data}
                            questionIndex={idx}
                            updateQuestion={updateQuestion}
                            deleteQuestion={deleteQuestion}
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
          <button className={styles.submitBtn} onClick={saveSurvey}>
            설문 생성
          </button>
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
