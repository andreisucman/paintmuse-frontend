import Parse from "parse";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useGetCurrentUser } from "../../helpers/useCurrentUser";
import { getReadableDate } from "../../helpers/getReadableDate";
import { startCheckout } from "../../helpers/startCheckout";
import styles from "../../styles/components/Account/BillingInfo.module.scss";
import ReactLoading from "react-loading";

export default function BillingInfo() {
  const currentUser = useGetCurrentUser();
  const [customerInfo, setCustomerInfo] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [fetched, setFetched] = useState(false);

  async function getCurrentPlan() {
    if (!currentUser) return;
    if (fetched) return;

    const User = Parse.Object.extend(Parse.User);
    const query = new Parse.Query(User);
    query.equalTo("customerId", currentUser.customerId);
    const result = await query.first();

    const customerPlan = result.attributes.customerPlan;

    let plan;
    switch (customerPlan) {
      case 0:
        plan = "Prepaid flexible";
        break;
      case 1:
        plan = "Monthly saving";
        break;
      case 2:
        plan = "Annual deal";
        break;
      default:
        plan = "Prepaid flexible";
    }

    setCustomerInfo({
      plan,
      quotaUsd: result.attributes.prepQuotaUsd,
      quotaImg: result.attributes.prepQuotaImg + result.attributes.subQuotaImg,
      renewsOn: getReadableDate(result.attributes.renewsOn),
    });

    setFetched(true);
  }

  async function handleUpgrade(currentPlan) {
    setButtonClicked(true);
    if (!currentUser) return;

    let priceId;
    switch (await currentPlan) {
      case "Prepaid flexible":
        priceId = "price_1M8ht9FOIAGAaeVilWOZlv9O";
        break;
      case "Monthly saving":
        priceId = "price_1M8i6tFOIAGAaeViafj6h8oL";
        break;
      default:
        throw new Error("Plan is undefined");
    }

    const params = {
      priceId,
      currentUser,
      loadingSetter: setButtonClicked,
      mode: "subscription",
    };

    await startCheckout(params);
    setButtonClicked(false);
  }

  useEffect(() => {
    getCurrentPlan();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.container__wrapper}>
        <h2 className={styles.container__title}>Billing</h2>
        {customerInfo && (
          <div className={styles.container__content}>
            <div className={styles.container__row}>
              <ul className={styles.table}>
                <li className={styles.table__item}>
                  Current plan: {customerInfo.plan}
                </li>
                {customerInfo.plan === "Prepaid flexible" && (
                  <li className={styles.table__item}>
                    Prepaid balance: ${customerInfo.quotaUsd.toFixed(1)}
                  </li>
                )}
                <li className={styles.table__item}>
                  Image quota: {customerInfo.quotaImg}
                </li>
                {customerInfo.plan !== "Prepaid flexible" && (
                  <>
                    <li className={styles.table__item}>
                      Renews on: {customerInfo.renewsOn}
                    </li>
                    <li
                      className={`${styles.table__item} ${styles.table__item_cancel}`}
                    >
                      <Link
                        href={`${process.env.NEXT_PUBLIC_CUSTOMER_PORTAL}/p/login/test_fZe4gG2yU6mN3bG5kk`}
                      >
                        Cancel subscription
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div className={styles.container__row}>
              {customerInfo.plan !== "Annual deal" && (
                <button
                  className={styles.container__button}
                  onClick={() => handleUpgrade(customerInfo.plan)}
                >
                  {buttonClicked ? (
                    <ReactLoading
                      width={19}
                      height={19}
                      type={"bars"}
                      color="#ffffff"
                    />
                  ) : (
                    <>
                      {customerInfo && customerInfo.plan === "Prepaid flexible"
                        ? "Save with monthly plan"
                        : "Save more with annual plan"}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
