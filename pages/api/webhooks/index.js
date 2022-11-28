import Parse from "parse";
import Stripe from "stripe";
import { buffer } from "micro";
import Cors from "micro-cors";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

const webhookHandler = async (req, res) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const signature = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        buf.toString(),
        signature,
        webhookSecret
      );
    } catch (err) {
      // On error, log and return the error message.
      console.log(`❌ Error message: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type === "checkout.session.completed") {
      const object = event.data.object;

    //   if (object.status === "complete") {
    //     const query = new Parse.Query(Parse.User);
    //     query.equalTo("customerId", object.customer);
    //     const result = await query.first();

    //     if (object.mode === "payment") {
    //       const currentUsdQuota = result.attributes.quotaUsd;
    //       const currentImgQuota = result.attributes.quotaImg;
    //       const newUsdQuota = currentUsdQuota + object.amount_subtotal / 100;
    //       const newImgQuota =
    //         currentImgQuota +
    //         Math.round(
    //           object.amount_subtotal /
    //             100 /
    //             process.env.PREPAID_PLAN_IMAGE_PRICE
    //         );
    //       result.set("quotaUsd", newUsdQuota);
    //       result.set("quotaImg", newImgQuota);
    //       await result.save();
    //     }
    //   }

    //   if (object.mode === "subscription") {
    //     const currentExpirationDate = result.attributes.renewsOn;
    //     if (object.amount_subtotal < 100) {
    //       const newExpirationDate = new Date(Math.round(currentExpirationDate / 1000) + 2629743);
    //       result.set("renewsOn", newExpirationDate);
    //       result.set("customerPlan", 1);
    //       result.set("quotaImg", 90);
    //       await result.save();
    //     } else {
    //       const newExpirationDate = new Date(Math.round(currentExpirationDate / 1000) + 31556926);
    //       result.set("renewsOn", newExpirationDate);
    //       result.set("customerPlan", 2);
    //       result.set("quotaImg", 2160);
    //       await result.save();
    //     }
    //   }
    // }

    // Return a response to acknowledge receipt of the event.
    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default cors(webhookHandler);
