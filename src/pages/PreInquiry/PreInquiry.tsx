import { useEffect, useState } from 'react';
import styles from './PreInquiry.module.scss';
import { axiosInstance } from '../../api/axios';
import { ISurveyData } from '../Main/Main';

interface IPreInquiryType {
    id: string;
    name: string;
    status: string;
    surveyList: ISurveyData[];
}
function PreInquiry() {
    const [preInquiryList, setPreInquiryList] = useState<IPreInquiryType[]>();
    useEffect(() => {
        axiosInstance
            .get('/api/preinquiries')
            .then((res) => setPreInquiryList(res.data.data));
    }, []);

    const [selectedInquiryId, setSelectedInquiryId] = useState('');
    return (
        <>
            <div>
                <ul>
                    {preInquiryList?.map((inquiry) => (
                        <li
                            key={inquiry.id}
                            onClick={() => setSelectedInquiryId(inquiry.id)}
                        >
                            {inquiry.name}
                        </li>
                    ))}
                </ul>
            </div>
            {selectedInquiryId && (
                <UserModal
                    inquiryId={selectedInquiryId}
                    onSubmit={() => {
                        setSelectedInquiryId('');
                    }}
                />
            )}
        </>
    );
}
export default PreInquiry;

function UserModal({
    inquiryId,
    onSubmit,
}: {
    inquiryId: string;
    onSubmit: () => void;
}) {
    const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
    useEffect(() => {
        axiosInstance
            .get('/api/members')
            .then((res) => setUsers(res.data.data));
    }, []);

    async function handleInquiryRequest(id: string) {
        await axiosInstance.post(`/api/members/${id}/preinquiries`, {
            data: [inquiryId],
        });
        alert('사전문진 요청을 발송하였습니다.');
        onSubmit();
    }
    return (
        <div className={styles.dimed}>
            <div className={styles.modal}>
                <h3>어떤 사용자에게 사전문진을 전송하시겠어요?</h3>
                <ul>
                    {users.map((user) => (
                        <li
                            key={user.id}
                            onClick={() => handleInquiryRequest(user.id)}
                        >
                            {user.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
