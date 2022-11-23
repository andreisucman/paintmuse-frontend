import styles from "../../styles/components/common/Alert.module.scss";

export default function Alert({ setShowAlert, message }) {
  return (
    <div className={styles.container}>
      <div className={styles.container__wrapper}>
        <div className={styles.container__close} onClick={() => setShowAlert(false)}></div>
        <p className={styles.container__message}>{message}</p>
      </div>
    </div>
  );
}
