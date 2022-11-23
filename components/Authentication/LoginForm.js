import { useEffect } from "react";
import { useGetCurrentState, useGetMethods } from "../common/ContextProvider";
import ls from "localstorage-slim";
import ResetPassword from "./ResetPassword";
import styles from "../../styles/components/Authentication/LoginForm.module.scss";

export default function LoginForm({
  loginData,
  setLoginData,
  handleFormEntry,
  handleAuthentication,
  authErrors,
}) {
  const { showResetPassword } = useGetCurrentState();
  const { setShowResetPassword } = useGetMethods();

  return (
    <>
      <form className={styles.container} onSubmit={(e) => e.preventDefault()}>
        <input
          className={
            authErrors.email
              ? `${styles.container__input} ${styles.container__input_error}`
              : styles.container__input
          }
          type="email"
          placeholder="Enter your email"
          onChange={(e) => handleFormEntry(e, loginData, "email", setLoginData)}
          autoComplete="email"
        />
        <input
          className={
            authErrors.password
              ? `${styles.container__input} ${styles.container__input_error}`
              : styles.container__input
          }
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          onChange={(e) =>
            handleFormEntry(e, loginData, "password", setLoginData)
          }
        />
        <button
          type="submit"
          className={styles.container__button}
          onClick={() => handleAuthentication({ authType: "login" })}
        >
          Log in
        </button>
        <p
          className={styles.container__forgot_password}
          onClick={() => setShowResetPassword((prevValue) => !prevValue)}
        >
          Forgot password?
        </p>
      </form>
      {showResetPassword && (
        <ResetPassword
          loginPage={true}
          setShowResetPassword={setShowResetPassword}
        />
      )}
    </>
  );
}
