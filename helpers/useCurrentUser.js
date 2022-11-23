import ls from "localstorage-slim";

export function useIsLoggedIn() {
  let user;
  user = ls.get(`Parse/${process.env.NEXT_PUBLIC_APP_ID}/currentUser`);

  return (user !== undefined && user !== null);
}

export function useGetCurrentUser() {
  const user = ls.get(`Parse/${process.env.NEXT_PUBLIC_APP_ID}/currentUser`);
  return user;
}
