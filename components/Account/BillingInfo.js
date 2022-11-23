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
            <button className={styles.container__button}>Choose your plan</button>
          </div>
        </div>
      </div>
    </div>
  );
}
