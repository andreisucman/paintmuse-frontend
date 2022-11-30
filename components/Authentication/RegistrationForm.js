import Link from "next/link";
import ls from "localstorage-slim";
import styles from "../../styles/components/Authentication/RegistrationForm.module.scss";

export default function RegistrationForm({
  registrationData,
  setRegistrationData,
  handleFormEntry,
  handleAuthentication,
  authErrors,
}) {
  function handleSubmit(e) {
    e.preventDefault();
    ls.set("paintmuse_registration", null);
  }

  return (
    <form className={styles.container} onSubmit={(e) => handleSubmit(e)}>
      <input
        className={styles.container__input}
        type="text"
        placeholder="Enter your name"
        onChange={(e) =>
          handleFormEntry(e, registrationData, "name", setRegistrationData)
        }
      />
      <input
        className={
          authErrors.email
            ? `${styles.container__input} ${styles.container__input_error}`
            : styles.container__input
        }
        type="email"
        placeholder="Enter your email"
        autoComplete="email"
        onChange={(e) =>
          handleFormEntry(e, registrationData, "email", setRegistrationData)
        }
      />
      <input
        className={
          authErrors.password
            ? `${styles.container__input} ${styles.container__input_error}`
            : styles.container__input
        }
        type="password"
        placeholder="Enter your password"
        autoComplete="new-password"
        onChange={(e) =>
          handleFormEntry(
            e,
            registrationData,
            "passwordOne",
            setRegistrationData
          )
        }
      />
      <input
        className={styles.container__input}
        type="password"
        placeholder="Repeat your password"
        onChange={(e) =>
          handleFormEntry(
            e,
            registrationData,
            "passwordTwo",
            setRegistrationData
          )
        }
        autoComplete="new-password"
      />
      <div
        className={
          authErrors.terms
            ? `${styles.terms__div} ${styles.terms__div_error}`
            : styles.terms__div
        }
        style={{ paddingBottom: "4px" }}
      >
        <label
          htmlFor="agree_with_terms"
          className={styles.terms__checkbox_label}
        >
          <input
            className={styles.terms__checkbox_input}
            id="agree_with_terms"
            type="checkbox"
            onChange={() =>
              setRegistrationData(
                Object.assign({}, registrationData, {
                  termsAccepted: !registrationData.termsAccepted,
                })
              )
            }
          />
        </label>
        <p>
          I've read and accept{" "}
          <Link href="/terms" className={styles.terms__link}>
            Terms and Conditions
          </Link>
        </p>
      </div>
      <div
        className={
          authErrors.usage
            ? `${styles.terms__div} ${styles.terms__div_error}`
            : styles.terms__div
        }
        style={{ paddingTop: "4px" }}
      >
        <label
          htmlFor="agree_with_terms"
          className={styles.terms__checkbox_label}
        >
          <input
            className={styles.terms__checkbox_input}
            id="agree_with_terms"
            type="checkbox"
            onChange={() =>
              setRegistrationData(
                Object.assign({}, registrationData, {
                  usageAccepted: !registrationData.usageAccepted,
                })
              )
            }
          />
        </label>
        <p>
          I agree to generate only safe content in accordance with the{" "}
          <Link href="/usage" className={styles.terms__link}>
            Usage Policy
          </Link>
        </p>
      </div>
      <button
        className={styles.container__button}
        onClick={() => handleAuthentication({ authType: "registration" })}
      >
        Register
      </button>
    </form>
  );
}
