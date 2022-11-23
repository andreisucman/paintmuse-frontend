import styles from "../../styles/components/common/LoadMoreButton.module.scss";

export default function LoadMoreButton({ onClickHandler }) {
  return (
    <button className={styles.container} onClick={onClickHandler}>
      Load more
    </button>
  );
}
