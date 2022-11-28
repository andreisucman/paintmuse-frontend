import { useEffect, useState } from "react";
import { useGetCurrentUser } from "../../helpers/useCurrentUser";
import styles from "../../styles/components/Account/BillingInfo.module.scss";

export default function BillingInfo() {
  const currentUser = useGetCurrentUser();
  const [user, setUser] = useState(null);

  return (
    <div className={styles.container}>
      <div className={styles.container__wrapper}>
        <h2 className={styles.container__title}>Billing</h2>
        <div className={styles.container__content}>
          <div className={styles.container__row}>
            <ul className={styles.table}>
              <li className={styles.table__item}>Current plan: Prepaid flexible</li>
              <li className={styles.table__item}>Balance in USD: 9.73</li>
              <li className={styles.table__item}>Balance in images: 21</li>
              <li className={styles.table__item}>Started on: 22 Nov 2022</li>
              <li className={styles.table__item}>Renews on: 22 Dec 2022</li>
              <li className={`${styles.table__item} ${styles.table__item_cancel}`}>Cancel subscription</li>
            </ul>
          </div>
          <div className={styles.container__row}>
            <button className={styles.container__button}>Save with monthly plan</button>
          </div>
        </div>
      </div>
    </div>
  );
}
