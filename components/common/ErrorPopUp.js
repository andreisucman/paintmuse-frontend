import Link from "next/link";
import { useGetCurrentState, useGetMethods } from "./ContextProvider";
import styles from "../../styles/components/common/ErrorPopUp.module.scss";

export default function ErrorPopUp() {
  const { isError } = useGetCurrentState();
  const { setIsError } = useGetMethods();

  return (
    <section className={styles.container}>
      <div className={styles.container__wrapper}>
        <div className={styles.container__close} onClick={() => setIsError({ value: false })}></div>
        <p className={styles.container__title}>Oops... An error occured.</p>
        <p className={styles.container__message}>
          {isError && isError.message}
        </p>
        <p className={styles.container__message}>
          If you're still facing issues please{" "}
          <Link href="/contact">
            <u>contact us.</u>
          </Link>
        </p>
      </div>
    </section>
  );
}
