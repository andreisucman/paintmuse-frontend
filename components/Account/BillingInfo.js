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
  const [upgradeClicked, setUpgradeClicked] = useState(false);
  const [topUpClicked, setTopUpClicked] = useState(false);
  const [fetched, setFetched] = useState(false);

  async function getCurrentPlan() {
    if (!currentUser) return;
    if (fetched) return;

    const User = Parse.Object.extend(Parse.User);
    const query = new Parse.Query(User);
    query.equalTo("customerId", currentUser.customerId);
    const result = await query.first();

    const customerPlan = result.attributes.customerPlan;
    const planCancelled = result.attributes.cancelledPlan > 0;

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
      planCancelled,
    });

    setFetched(true);
  }

  useEffect(() => {
    console.log(customerInfo);
  }, [customerInfo]);

  async function handleUpgrade(currentPlan, topup, loadingSetter) {
    loadingSetter(true);
    if (!currentUser) return;

    let priceId;
    let mode;

    if (currentPlan === "Prepaid flexible" && topup) {
      priceId = process.env.NEXT_PUBLIC_PREPAID_PRICE_ID;
      mode = "payment";
    } else if (currentPlan === "Prepaid flexible" && !topup) {
      priceId = process.env.NEXT_PUBLIC_MONTHLY_PRICE_ID;
      mode = "subscription";
    } else {
      priceId = process.env.NEXT_PUBLIC_ANNUAL_PRICE_ID;
      mode = "subscription";
    }

    const params = {
      priceId,
      currentUser,
      loadingSetter,
      mode,
    };

    await startCheckout(params);
    loadingSetter(false);
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
                {(customerInfo.plan !== "Prepaid flexible" ||
                  (customerInfo.plan === "Prepaid flexible" &&
                    customerInfo.planCancelled)) && (
                  <>
                    <li className={styles.table__item}>
                      {customerInfo.planCancelled
                        ? "Expires on: "
                        : "Renews on: "}
                      {customerInfo.renewsOn}
                    </li>
                    {!customerInfo.planCancelled && (
                      <li
                        className={`${styles.table__item} ${styles.table__item_cancel}`}
                      >
                        <a
                          href={`${process.env.NEXT_PUBLIC_STRIPE_PORTAL_URL}`}
                        >
                          Cancel subscription
                        </a>
                      </li>
                    )}
                  </>
                )}
                <li
                  className={`${styles.container__button} ${styles.container__button_ordinary}`}
                  onClick={() =>
                    handleUpgrade(customerInfo.plan, true, setTopUpClicked)
                  }
                  style={{ marginTop: "8px" }}
                >
                  {topUpClicked ? (
                    <ReactLoading
                      width={19}
                      height={19}
                      type={"bars"}
                      color="#000000"
                    />
                  ) : (
                    <>Top-up balance</>
                  )}
                </li>
                {customerInfo.plan !== "Annual deal" && (
                  <li
                    className={styles.container__button}
                    onClick={() =>
                      handleUpgrade(
                        customerInfo.plan,
                        undefined,
                        setUpgradeClicked
                      )
                    }
                    style={{ marginTop: "8px" }}
                  >
                    {upgradeClicked ? (
                      <ReactLoading
                        width={19}
                        height={19}
                        type={"bars"}
                        color="#ffffff"
                      />
                    ) : (
                      <>
                        {customerInfo &&
                        customerInfo.plan === "Prepaid flexible"
                          ? "Save with monthly plan"
                          : "Save more with annual plan"}
                      </>
                    )}
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
