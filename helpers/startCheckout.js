import axios from "axios";
import getStripe from "./getStripe";

export async function startCheckout({
  priceId,
  currentUser,
  loadingSetter,
  router,
  cardType,
  mode,
}) {
  loadingSetter(true);
  if (router) {
    if (!currentUser) router.push("/login");
  }

  const {
    data: { id },
  } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/checkout_sessions`, {
    items: [{ price: priceId, quantity: 1 }],
    mode: mode ? mode : cardType === "Prepaid flexible" ? "payment" : "subscription",
    email: currentUser.email,
  });

  const stripe = await getStripe();
  await stripe.redirectToCheckout({ sessionId: id });
  loadingSetter(false);
}
