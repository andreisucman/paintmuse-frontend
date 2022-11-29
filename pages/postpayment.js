import { useRouter } from "next/router";
import Link from "next/link";
import fetcher from "../helpers/fetcher";
import useSWR from "swr";
import styles from "../styles/Postpayment.module.scss";

export default function Postpayment() {
  const {
    query: { session_id },
  } = useRouter();

  const { data, error } = useSWR(
    () => `${process.env.NEXT_PUBLIC_SERVER_URL}/retrieveCheckout/${session_id}`,
    fetcher
  );

  return (
    <div className={styles.container}>
      <div className={styles.container__wrapper}>
        {error ? (
          <div className={styles.error}>
            <p className={styles.error__text}>Sorry, something went wrong!</p>
          </div>
        ) : data ? (
          <div className={styles.loading}>
            <p className={styles.loading__text}>Loading...</p>
          </div>
        ) : (
          <div className={styles.success}>
            <div className={styles.success__icon} />
            <div className={styles.success__title}>
              <div className={styles.success__text_div}>
                <h2 className={styles.success__text}>Payment successful!</h2>
                <p className={styles.success__receipt}>
                  We've sent the receipt to your inbox.
                </p>
                <p className={styles.success__cta}>
                  You can now start crafting your art.
                </p>
                <Link href="/account" className={styles.link}>Return to the account page</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
