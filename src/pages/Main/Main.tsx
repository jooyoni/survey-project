import { useNavigate } from 'react-router-dom';
import styles from './Main.module.scss';
function Main() {
    const navigate = useNavigate();
    return (
        <main className={styles.container}>
            <button onClick={() => navigate('/create-question')}>
                설문 생성
            </button>
        </main>
    );
}
export default Main;
