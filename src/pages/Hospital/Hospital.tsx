import { useEffect, useState } from 'react';
import styles from './Hospital.module.scss';
import { IQuestionType } from '../../types/questionType';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../api/axios';
import { v4 as uuidv4 } from 'uuid';

function Hospital() {
    const navigate = useNavigate();
    useEffect(() => {
        axiosInstance
            .get('/api/surveys')
            .then((res) => setSurveyList(res.data.data));
    }, []);
    const [surveyList, setSurveyList] = useState<
        {
            id: string;
            name: string;
            questionList: IQuestionType[];
            surveyCode: '공통' | '외과' | '내과';
        }[]
    >([]);

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    function handleSelect(id: string) {
        const INDEX = selectedIds.findIndex((val) => val === id);
        console.log(INDEX);
        if (INDEX === -1) {
            setSelectedIds((prev) => {
                return [...prev, id];
            });
        } else
            setSelectedIds((prev) => {
                const newValue = [...prev];
                newValue.splice(INDEX, 1);
                return newValue;
            });
    }

    function createInquiry() {
        const INQUIRY_NAME = window.prompt('사전문진 이름을 입력해주세요.');
        axiosInstance
            .post(`/api/preinquiry`, {
                id: uuidv4(),
                name: INQUIRY_NAME,
                surveyList: selectedIds,
            })
            .then((res) => console.log(res));
    }

    console.log(selectedIds);
    return (
        <div className={styles.hospitalContainer}>
            <h1>설문목록</h1>
            <ul className={styles.surveyList}>
                {surveyList.map((survey) => (
                    <li key={survey.id} onClick={() => handleSelect(survey.id)}>
                        <div
                            className={
                                selectedIds.includes(survey.id)
                                    ? styles.hit
                                    : ''
                            }
                        ></div>
                        <span>{survey.name}</span>
                    </li>
                ))}
            </ul>
            <button onClick={() => navigate('/create-question')}>
                설문 생성
            </button>
            <button onClick={createInquiry}>설문으로 사전문진 생성</button>
            <button onClick={() => navigate('/pre-inquiry')}>
                사전문진 페이지 이동
            </button>
        </div>
    );
}
export default Hospital;
