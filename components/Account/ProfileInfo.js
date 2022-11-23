import Parse from "parse";
import ls from "localstorage-slim";
import { useState, useEffect } from "react";
import { useIsLoggedIn, useGetCurrentUser } from "../../helpers/useCurrentUser";
import EditField from "./EditField";
import ResetPassword from "../Authentication/ResetPassword";
import { useGetMethods } from "../../components/common/ContextProvider";
import styles from "../../styles/components/Account/ProfileInfo.module.scss";

export default function ProfileInfo() {
  const [showEditField, setShowEditField] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [passwordPlaceholder, setPasswordPlaceholder] = useState([]);
  const { setShowResetPassword } = useGetMethods();

  useEffect(() => {
    if (useIsLoggedIn()) {
      setCurrentUser(useGetCurrentUser());
    }
  }, []);

  useEffect(() => {
    setPasswordPlaceholder(new Array(currentUser.passwordLength).fill("*"));
  }, [currentUser]);

  async function handleUpdateField(field, value) {
    Parse.initialize(process.env.NEXT_PUBLIC_APP_ID);
    Parse.serverURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/parse`;

    let updatedUser;
    try {
      updatedUser = await Parse.Cloud.run("updateField", {
        field,
        value,
        userId: currentUser.objectId,
      });

      ls.set(
        `Parse/${process.env.NEXT_PUBLIC_APP_ID}/currentUser`,
        Object.assign({}, currentUser, updatedUser)
      );

      setCurrentUser(Object.assign({}, currentUser, updatedUser));
    } catch (err) {
      console.log(err.message);
    }
  }

  function handleUpdatePassword() {
    setShowEditField("password");
    setTimeout(() => {
      setShowEditField("");
    }, 5000);
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.container__wrapper}>
          <h2 className={styles.container__title}>Profile</h2>
          <div className={styles.container__content}>
            <div className={styles.container__row}>
              <div className={styles.container__cell}>
                <p>Name</p>
                <p>{currentUser.name}</p>
              </div>
              <p
                className={styles.container__edit}
                onClick={() => setShowEditField("name")}
              >
                Edit
              </p>
            </div>
            <div className={styles.container__row}>
              <div className={styles.container__cell}>
                <p>User ID</p>
                <p>
                  {currentUser &&
                    currentUser.customerId &&
                    currentUser.customerId.slice(-10)}
                </p>
              </div>
              <p></p>
            </div>
            <div className={styles.container__row}>
              <div className={styles.container__cell}>
                <p>Password</p>
                <p>{passwordPlaceholder}</p>
              </div>
              <p
                className={styles.container__edit}
                onClick={handleUpdatePassword}
              >
                Reset
              </p>
            </div>
            <div className={styles.container__row}>
              <div className={styles.container__cell}>
                <p>E-mail</p>
                <p>{currentUser.email}</p>
              </div>
              <p
                className={styles.container__edit}
                onClick={() => setShowEditField("email")}
              >
                Edit
              </p>
            </div>
          </div>
        </div>
      </div>
      {showEditField === "name" && (
        <EditField
          fieldName={"name"}
          setShowEditField={setShowEditField}
          handleUpdateField={handleUpdateField}
        />
      )}
      {showEditField === "password" && (
        <ResetPassword
          loginPage={false}
          savedEmail={currentUser.email}
          setShowResetPassword={setShowResetPassword}
        />
      )}
      {showEditField === "email" && (
        <EditField
          fieldName={"email"}
          setShowEditField={setShowEditField}
          handleUpdateField={handleUpdateField}
          currentUser={currentUser}
        />
      )}
    </>
  );
}
