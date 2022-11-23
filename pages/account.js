import { useEffect } from "react";
import { useRouter } from "next/router";
import ProfileInfo from "../components/Account/ProfileInfo";
import BillingInfo from "../components/Account/BillingInfo";
import styles from "../styles/Account.module.scss";
import RequestsHistory from "../components/Account/RequestsHistory";
import { useIsLoggedIn } from "../helpers/useCurrentUser";

export default function Account() {
  const isLoggedIn = useIsLoggedIn();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn]);

  return (
    <div className={styles.container}>
      <div className={styles.container__wrapper}>
        <ProfileInfo />
        <BillingInfo />
        <RequestsHistory />
      </div>
    </div>
  );
}
