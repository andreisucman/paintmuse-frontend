import Parse from "parse";
import { useState } from "react";
import styles from "../../styles/components/Account/EditField.module.scss";

export default function EditField({
  fieldName,
  setShowEditField,
  handleUpdateField,
}) {
  const [newEmail, setNewEmail] = useState();
  const [newName, setNewName] = useState();
  const [nameNext, setNameNext] = useState(null);
  const [emailNext, setEmailNext] = useState(null);

  function handleUpdate() {
    if (fieldName === "name") {
      const response = handleUpdateField("name", newName);
      if (response) {
        setNameNext("Success! You've changed your name.");
      }
    } else if (fieldName === "email") {
      const response = handleUpdateField("email", newEmail);
      if (response) {
        setEmailNext(
          "Success! You've changed your email."
        );
      }
    }

    setTimeout(() => {
      setShowEditField(false);
    }, 5000);
  }

  return (
    <div className={styles.container}>
      <form className={styles.container__wrapper}>
        <div
          className={styles.container__close}
          onClick={() => setShowEditField("")}
        ></div>
        <h2 className={styles.container__title}>Edit {fieldName}</h2>
        <div className={styles.container__content}>
          {fieldName === "name" && !nameNext && (
            <input
              type="text"
              placeholder="Enter your new name"
              className={styles.container__input}
              onChange={(e) => setNewName(e.target.value)}
            />
          )}
          {nameNext && <div className={styles.container__next}>{nameNext}</div>}
          {fieldName === "email" && !emailNext && (
            <input
              type="email"
              placeholder="Enter your new email"
              className={styles.container__input}
              autoComplete="email"
              onChange={(e) => setNewEmail(e.target.value)}
            />
          )}
          {emailNext && (
            <div className={styles.container__next}>{emailNext}</div>
          )}
          {!nameNext && !emailNext && (
            <button className={styles.container__button} onClick={handleUpdate}>
              Save
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
