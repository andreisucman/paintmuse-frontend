import Parse from "parse";

export async function useRequestPasswordReset({
  setSuccessInfo,
  loginPage,
  email,
  savedEmail,
}) {
  Parse.initialize(process.env.NEXT_PUBLIC_APP_ID);
  Parse.serverURL = process.env.NEXT_PUBLIC_SERVER_URL_PARSE;

  try {
    await Parse.User.requestPasswordReset(loginPage ? email : savedEmail);

    setSuccessInfo(
      loginPage
        ? "If you have an account in our system you should receive an email with the password reset link shortly."
        : "The password reset link has been sent to your email address."
    );
  } catch (err) {
    setSuccessInfo(err.message);
  }
}
