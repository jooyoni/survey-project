import { useEffect, useState } from 'react';
import styles from './Survey.module.scss';
import { IQuestionForUserType, IQuestionType } from '../../types/questionType';
import { useParams } from 'react-router-dom';
import Answer from '../../components/Answer/Answer';

function Survey() {
    const [surveyData, setSurveyData] = useState<IQuestionForUserType[]>([]);
    const [title, setTitle] = useState('');
    const { id: surveyId } = useParams();

    useEffect(() => {
        if (!surveyId) return;
        const data = JSON.parse(localStorage.getItem('surveys') || '{}')[surveyId];
        setSurveyData([...data.questionData.map((data: IQuestionType) => ({ ...data, answer: [] }))]);
        setTitle(data.title);
    }, []);

    function updateSurveyData(id: string, data: IQuestionForUserType) {
        let question = surveyData.filter((question) => question.id === id)[0];
        // setSurveyData((prev) => {
        //     let newData = [...prev];
        //     newData[idx] = data;
        //     return newData;
        // });
        // 다음주 출근해서 data의 id 체크해서 업데이트 하는 방식 검토
    }

    const [nowPage, setNowPage] = useState(0);
    const [lastPage, setLastPage] = useState(0);

    useEffect(() => {
        setLastPage(surveyData.filter((question) => question.isShow).length);
    }, [surveyData]);

    function handleBeforePage() {
        setNowPage((prev) => prev - 1);
    }
    function handleNextPage() {
        // if (surveyData[nowPage].answer.length > 0)
        setNowPage((prev) => prev + 1);
    }

    console.log(title);
    return (
        <main className={styles.container}>
            <div className={styles.contentWrap}>
                <div className={styles.page}>
                    {nowPage + 1}/{lastPage}
                </div>
                {surveyData[nowPage] && <Answer updateAllData={updateSurveyData} questionData={surveyData[nowPage]} />}

                <div className={styles.submitBtnWrap}>
                    {nowPage > 0 && (
                        <button className={styles.before} onClick={handleBeforePage}>
                            이전
                        </button>
                    )}
                    <button className={styles.next} onClick={handleNextPage}>
                        다음
                    </button>
                </div>
            </div>
        </main>
    );
}
export default Survey;
