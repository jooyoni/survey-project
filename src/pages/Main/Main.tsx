import { useNavigate } from 'react-router-dom';
import styles from './Main.module.scss';
import { useEffect, useState } from 'react';
import { IQuestionType } from '../../types/questionType';
function Main() {
    const navigate = useNavigate();
    const [surveyData, setSurveyData] = useState<{
        [key: string]: {
            title: string;
            questionData: IQuestionType[];
        };
    }>({});

    useEffect(() => {
        setSurveyData(JSON.parse(localStorage.getItem('surveys') || '{}'));
    }, []);
    return (
        <main className={styles.container}>
            <button onClick={() => navigate('/create-question')}>설문 생성</button>
            <ul className={styles.surveyList}>
                {Object.keys(surveyData).map((key) => (
                    <li key={key} onClick={() => navigate(`/survey/${key}`)}>
                        {surveyData[key].title}
                    </li>
                ))}
                {/* {surveyData.map((survey) => {
                    const SURVEY_KEY = Object.keys(survey)[0];
                    console.log(SURVEY_KEY);
                    return <li key={SURVEY_KEY}>{SURVEY_KEY}</li>;
                })} */}
            </ul>
        </main>
    );
}
export default Main;
