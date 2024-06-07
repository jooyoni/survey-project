import { useNavigate } from 'react-router-dom';
import styles from './Main.module.scss';
import { useEffect, useState } from 'react';
import { IQuestionType } from '../../types/questionType';
import { axiosInstance } from '../../api/axios';

export interface ISurveyData {
    id: string;
    name: string;
    questionList: IQuestionType[];
    surveyCode: '공통' | '외과' | '내과';
}
export interface IPatientPreinquiryData {
    id: string;
    name: string;
    preInquiryList: {
        id: string;
        name: string;
        status: string;
        surveyList: ISurveyData[];
    }[];
}

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

    const [id, setId] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    function handleLogin() {
        axiosInstance.post('/api/members/login', { id }).then((res) => {
            setIsLoggedIn(true);
            setUser(id);
            localStorage.setItem(
                'patient-surveys',
                JSON.stringify(res.data.data)
            );
            setPatientData(res.data.data);
            if (id === 'hospital') navigate('/hospital');
        });
    }

    const [patientData, setPatientData] = useState<IPatientPreinquiryData>();

    const [user, setUser] = useState('');
    console.log(patientData);

    return !isLoggedIn ? (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                }}
            >
                <div>
                    <input
                        type='text'
                        value={id}
                        onChange={(e) => setId(e.currentTarget.value)}
                    />
                    <button>로그인</button>
                </div>
            </form>
        </div>
    ) : user === 'hospital' ? (
        <div></div>
    ) : (
        <ul className={styles.preinquiryList}>
            {patientData?.preInquiryList.map((inquiry) => (
                <li
                    key={inquiry.id}
                    onClick={() => navigate(`/survey/${inquiry.id}`)}
                >
                    {inquiry.name}
                </li>
            ))}
        </ul>
    );
    // <main className={styles.container}>
    //     <button onClick={() => navigate('/create-question')}>
    //         설문 생성
    //     </button>
    //     <ul className={styles.surveyList}>
    //         {Object.keys(surveyData).map((key) => (
    //             <li key={key}>
    //                 <div onClick={() => navigate(`/result/${key}`)}>
    //                     <span>{surveyData[key].title}</span>
    //                 </div>
    //                 <button onClick={() => navigate(`/survey/${key}`)}>
    //                     설문 참여하기
    //                 </button>
    //                 <button onClick={() => handleDelete(key)}>삭제</button>
    //             </li>
    //         ))}
    //         {/* {surveyData.map((survey) => {
    //               const SURVEY_KEY = Object.keys(survey)[0];
    //               console.log(SURVEY_KEY);
    //               return <li key={SURVEY_KEY}>{SURVEY_KEY}</li>;
    //           })} */}
    //     </ul>
    // </main>
}
export default Main;
