import { useEffect, useState } from 'react';
import styles from './Survey.module.scss';
import { IQuestionForUserType, IQuestionType } from '../../types/questionType';
import { useNavigate, useParams } from 'react-router-dom';
import Answer from '../../components/Answer/Answer';
import { v4 as uuidv4 } from 'uuid';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import SwiperCore from 'swiper';
import { IPatientPreinquiryData, ISurveyData } from '../Main/Main';

function Survey() {
    const navigate = useNavigate();
    const [swiper, setSwiper] = useState<SwiperCore>();
    const [activeIdx, setActiveIdx] = useState(0);

    // const [surveyData, setSurveyData] = useState<IQuestionForUserType[]>([]);
    const [showingSurveyData, setShowingSurveyData] = useState<
        IQuestionForUserType[]
    >([]);

    const [title, setTitle] = useState('');
    const { id: surveyId } = useParams();

    useEffect(() => {
        if (!surveyId) return;
        const data: IPatientPreinquiryData = JSON.parse(
            localStorage.getItem('patient-surveys') || '{}'
        );
        let test: any;
        data.preInquiryList.map((preinquiry) => {
            if (preinquiry.id === surveyId) test = preinquiry.surveyList;
            return null;
        });
        test = test.map((inquiry: any) => {
            let newInquiry: any = inquiry;
            for (let i = 0; i < inquiry.questionList.length; i++) {
                console.log();
                newInquiry.questionList[i].answer = [];
            }
            return newInquiry;

            // const newInquiry = inquiry.questionList.map((question: any) => {
            //     const newQuestion = question;
            //     newQuestion.answer = [];
            //     return newQuestion;
            // });
        });
        setSurveyData(test);
        // setSurveyData([...data.questionData.map((data: IQuestionType) => ({ ...data, answer: [] }))]);
        // setTitle(data.title);
        // console.log(title);
    }, []);

    const [surveyData, setSurveyData] = useState<ISurveyData[]>([]);

    console.log(surveyData);
    // function updateSurveyData(id: string, data: IQuestionForUserType) {
    //     let newSurveyData: {
    //         [key: string]: IQuestionForUserType;
    //     } = surveyData.reduce((accumulator, value) => {
    //         return { ...accumulator, [value.id]: value };
    //     }, {});
    //     newSurveyData[id] = { ...data }; //변경된 answer 반영
    //     newSurveyData[id].optionList?.map((option) => {
    //         // 업데이트된 질문의 옵션 돌면서,
    //         if (newSurveyData[id].answer.includes(option.id))
    //             // 해당 옵션이 업데이트된 질문의 정답에 포함되면 타겟 질문 추가 노출
    //             option.target.map((targetId) => {
    //                 // newSurveyData[targetId].isShow.push(option.id);
    //                 newSurveyData[targetId].isShow = true;
    //             });
    //         else {
    //             option.target.map((targetId) => {
    //                 // newSurveyData[targetId].isShow = newSurveyData[
    //                 //     targetId
    //                 // ].isShow.filter((id) => id !== option.id);
    //                 newSurveyData[targetId].isShow = newSurveyData[
    //                     targetId
    //                 ].isShow = false;
    //                 return null;
    //             });
    //         }
    //         return null;
    //     });
    //     // setSurveyData(Object.values(newSurveyData));
    // }

    // useEffect(() => {
    //     setShowingSurveyData(
    //         surveyData.filter((question) => question.isShow.length)
    //     );
    // }, [surveyData]);

    function handleBeforePage() {
        swiper?.slidePrev();
    }
    function handleNextPage() {
        swiper?.slideNext();
    }
    function handleSubmit() {
        // let data = showingSurveyData.map((question) => {
        //     if (!question.isShow.length) question.answer = [];
        //     return question;
        // });
        // let isRequiredError = false;
        // let firstRequiredErrorIdx: number;
        // data.forEach((question, idx) => {
        //     if (
        //         question.isRequired.length &&
        //         question.isShow.length &&
        //         !(question.answer.length && question.answer[0])
        //     ) {
        //         isRequiredError = true;
        //         if (isNaN(firstRequiredErrorIdx)) firstRequiredErrorIdx = idx;
        //     }
        // });
        // if (isRequiredError) {
        //     swiper?.slideTo(firstRequiredErrorIdx!);
        //     console.log(firstRequiredErrorIdx!);
        //     alert('필수 입력사항을 모두 입력해주세요.');
        //     return;
        // }
        // let db = JSON.parse(localStorage.getItem('surveys') || '{}');
        // db[surveyId || ''].results[uuidv4()] = data;
        // localStorage.setItem('surveys', JSON.stringify(db));
        // navigate('/');
    }

    return (
        <main className={styles.container}>
            <div className={styles.contentWrap}>
                <div className={styles.page}>
                    {swiper?.activeIndex + 1}/{showingSurveyData.length}
                </div>

                <ul>
                    {surveyData.map((survey) =>
                        survey.questionList.map((question) => (
                            <li key={question.id}>
                                {/* <h3>{question.question}</h3> */}
                                <Answer
                                    // updateAllData={updateSurveyData}
                                    questionData={question}
                                />
                            </li>
                        ))
                    )}
                </ul>
                {/* 
                <Swiper
                    touchRatio={0}
                    onSwiper={setSwiper}
                    onSlideChange={(swiper: SwiperCore) =>
                        setActiveIdx(swiper.activeIndex)
                    }
                >
                    {showingSurveyData.map((data) => (
                        <SwiperSlide key={data.id}>
                            <Answer
                                updateAllData={updateSurveyData}
                                questionData={data}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper> */}

                <div className={styles.submitBtnWrap}>
                    {activeIdx > 0 && (
                        <button
                            className={styles.before}
                            onClick={handleBeforePage}
                        >
                            이전
                        </button>
                    )}
                    {activeIdx + 1 !== showingSurveyData.length && (
                        <button
                            className={styles.next}
                            onClick={handleNextPage}
                        >
                            다음
                        </button>
                    )}
                    {activeIdx + 1 === showingSurveyData.length && (
                        <button
                            className={styles.submit}
                            onClick={handleSubmit}
                        >
                            설문 제출
                        </button>
                    )}
                </div>
            </div>
        </main>
    );
}
export default Survey;
