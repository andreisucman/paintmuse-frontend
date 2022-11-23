import styles from "../../styles/components/common/Buttons.module.scss";
import { downloadImage } from "../../helpers/downloadImage";

export default function Buttons({ src, isBulk }) {
  return (
    <div className={styles.buttons}>
      <button href={src}
        className={`${styles.buttons__button} ${styles.buttons__button_download}`}
        onClick={() => downloadImage(src, isBulk)}
      >
        Download
      </button>
    </div>
  );
}
