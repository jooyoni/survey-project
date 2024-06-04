import styles from './MultipleChoiceMark.module.scss';

interface IPropsType {
    isCircle?: boolean;
}
function MultipleChoiceMark({ isCircle = false }: IPropsType) {
    return <button className={styles.container} style={{ borderRadius: isCircle ? '50%' : '4px' }}></button>;
}
export default MultipleChoiceMark;
