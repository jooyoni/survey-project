import { useNavigate } from 'react-router-dom';
import styles from './Main.module.scss';
import { useEffect, useState } from 'react';
import { IQuestionType } from '../../types/questionType';
import { axiosInstance } from '../../api/axios';
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

    function handleDelete(key: string) {
        let db = JSON.parse(localStorage.getItem('surveys') || '{}');
        delete db[key];
        setSurveyData(db);
        localStorage.setItem('surveys', JSON.stringify(db));
    }

    useEffect(() => {
        axiosInstance.post('/api/members/login', { id: 'patient' });
    }, []);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return !isLoggedIn ? (
        <div>test</div>
    ) : (
        <main className={styles.container}>
            <button onClick={() => navigate('/create-question')}>
                설문 생성
            </button>
            <ul className={styles.surveyList}>
                {Object.keys(surveyData).map((key) => (
                    <li key={key}>
                        <div onClick={() => navigate(`/result/${key}`)}>
                            <span>{surveyData[key].title}</span>
                        </div>
                        <button onClick={() => navigate(`/survey/${key}`)}>
                            설문 참여하기
                        </button>
                        <button onClick={() => handleDelete(key)}>삭제</button>
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
