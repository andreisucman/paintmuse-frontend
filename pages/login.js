import Parse from "parse";
import Link from "next/link";
import ls from "localstorage-slim";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useGetMethods } from "../components/common/ContextProvider";
import Alert from "../components/common/Alert";
import LoginForm from "../components/Authentication/LoginForm";
import RegistrationForm from "../components/Authentication/RegistrationForm";
import styles from "../styles/Login.module.scss";

export default function Login() {
  const router = useRouter();
  const methods = useGetMethods();
  const savedRegistrationData = ls.get("paintmuse_registration");
  const savedLoginData = ls.get("paintmuse_login");

  const [activeScreen, setActiveScreen] = useState("Log in");
  const [loginData, setLoginData] = useState({});
  const [registrationData, setRegistrationData] = useState({
    termsAccepted: false,
    usageAccepted: false,
  });
  const [authErrors, setAuthErrors] = useState({});
  const [messageFromServer, setMessageFromServer] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (savedRegistrationData) {
      setRegistrationData(savedRegistrationData);
    }
    if (savedLoginData) {
      setLoginData(savedLoginData);
    }
  }, []);

  function validateForm({ formType, data, setAuthErrors, authErrors }) {
    if (formType === "login") {
      if (!data.email || !data.password) {
        if (!data.email) {
          setAuthErrors(Object.assign({}, authErrors, { email: true }));
        }
        if (!data.password) {
          setAuthErrors(Object.assign({}, authErrors, { password: true }));
        }

        setTimeout(() => {
          setAuthErrors({});
        }, 3000);
        return false;
      }
      return true;
    } else {
      if (
        !data.termsAccepted ||
        !data.usageAccepted ||
        !data.passwordOne ||
        !data.passwordTwo ||
        !data.email
      ) {
        if (!data.termsAccepted) {
          setAuthErrors(Object.assign({}, authErrors, { terms: true }));
        }
        if (!data.usageAccepted) {
          setAuthErrors(Object.assign({}, authErrors, { usage: true }));
        }
        if (!data.email) {
          setAuthErrors(Object.assign({}, authErrors, { email: true }));
        }
        if (!data.passwordOne) {
          setAuthErrors(Object.assign({}, authErrors, { passwordOne: true }));
        }
        if (!data.passwordTwo) {
          setAuthErrors(Object.assign({}, authErrors, { passwordTwo: true }));
        }

        setTimeout(() => {
          setAuthErrors({});
        }, 3000);

        return false;
      }
      return true;
    }
  }

  const handleAuthentication = async ({ authType }) => {
    // validate on the client
    const validation = validateForm({
      formType: authType === "registration" ? "registration" : "login",
      data: authType === "registration" ? registrationData : loginData,
      setAuthErrors,
      authErrors,
    });

    if (!validation) return;

    Parse.initialize(process.env.NEXT_PUBLIC_APP_ID);
    Parse.serverURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/parse`;

    try {
      let response;

      if (authType === "registration") {
        response = await Parse.Cloud.run("register", registrationData);

        console.log(response)

        if ((await response.code) === 0) {
          ls.set(
            `Parse/${process.env.NEXT_PUBLIC_APP_ID}/currentUser`,
            response.user
          );
          router.push("/account");
        } else {
          // display the result of server validation
          setMessageFromServer(response);
          setShowAlert(true);
        }
      } else {
        try {
          await Parse.User.logIn(loginData.email, loginData.password);
          router.push("/account");
        } catch (err) {
          setMessageFromServer(err);
          setShowAlert(true);
        }
      }
    } catch (err) {
      throw console.log(err);
    }
  };

  const handleFormEntry = (e, data, field, setter) => {
    setter(Object.assign({}, data, { [field]: e.target.value }));
  };

  return (
    <div className={styles.container}>
      {showAlert && (
        <Alert
          setShowAlert={setShowAlert}
          message={messageFromServer.message}
        />
      )}
      <Link
        className={styles.container__close}
        href="/"
        onClick={() => methods.setActiveLink("/")}
      />
      <div className={styles.container__wrapper}>
        <div className={styles.selection_buttons}>
          <button
            className={
              activeScreen === "Log in"
                ? `${styles.selection_buttons__button} ${styles.selection_buttons__button_active}`
                : styles.selection_buttons__button
            }
            onClick={() => setActiveScreen("Log in")}
          >
            Log in
          </button>
          <button
            className={
              activeScreen !== "Log in"
                ? `${styles.selection_buttons__button} ${styles.selection_buttons__button_active}`
                : styles.selection_buttons__button
            }
            onClick={() => setActiveScreen("Register")}
          >
            Register
          </button>
        </div>
        <h2 className={styles.container__title}>{activeScreen} to continue</h2>
        {activeScreen === "Register" ? (
          <RegistrationForm
            registrationData={registrationData}
            setRegistrationData={setRegistrationData}
            handleFormEntry={handleFormEntry}
            handleAuthentication={handleAuthentication}
            authErrors={authErrors}
          />
        ) : (
          <LoginForm
            loginData={loginData}
            setLoginData={setLoginData}
            handleFormEntry={handleFormEntry}
            handleAuthentication={handleAuthentication}
            authErrors={authErrors}
          />
        )}
      </div>
    </div>
  );
}
