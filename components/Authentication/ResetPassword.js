import Parse from "parse";
import { useState, useEffect } from "react";
import styles from "../../styles/components/Authentication/ResetPassword.module.scss";

export default function ResetPassword({
  loginPage,
  setShowResetPassword,
  savedEmail,
}) {
  const [email, setEmail] = useState();
  const [emailNext, setEmailNext] = useState(null);

  useEffect(() => {
    if (!loginPage) {
      requestPasswordReset(savedEmail);
    }
  }, []);

  async function requestPasswordReset(savedEmail) {
    Parse.initialize(process.env.NEXT_PUBLIC_APP_ID);
    Parse.serverURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/parse`;

    try {
      await Parse.User.requestPasswordReset(loginPage ? email : savedEmail);

      setEmailNext(
        loginPage
          ? "If you have an account in our system you should receive an email with the password reset link shortly."
          : "The password reset link has been sent to your email address."
      );

      setTimeout(() => {
        setShowResetPassword(false);
      }, [3000]);
    } catch (err) {
      setEmailNext(err.message);
    }
  }

  return (
    <div className={styles.container}>
      <form
        className={styles.container__wrapper}
        onSubmit={(e) => e.preventDefault()}
      >
        {loginPage && (
          <div
            className={styles.container__close}
            onClick={() => setShowResetPassword(false)}
          ></div>
        )}
        <h2 className={styles.container__title}>
          {emailNext ? "Request sent" : "Request password reset"}
        </h2>
        <div className={styles.container__content}>
          {!emailNext && loginPage && (
            <input
              type="email"
              placeholder="Enter you account's email address"
              className={styles.container__input}
              autoComplete="email"
              disabled={emailNext}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
          {emailNext && (
            <div className={styles.container__next}>{emailNext}</div>
          )}
          {!emailNext && loginPage && (
            <button
              className={styles.container__button}
              onClick={requestPasswordReset}
            >
              Reset password
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
