import styles from "../styles/Pricing.module.scss";
import PricingCard from "../components/PricingCard";
import Link from "next/link";

export default function Pricing() {
  const data = [
    {
      title: "Pay as you go",
      card_type: "pay_as_you_go",
      subtitle_info: "You pay per image",
      quota: null,
      price: null,
      pricePerImage: "0.45",
      privacy: "Public",
      privacy_message: "Everyone can see the images you generated."
    },
    {
      title: "Monthly subscription",
      card_type: "monthly_subscription",
      subtitle_info:
        "Better value per image. Extras are billed per pay-as-you-go plan.",
      quota: "90",
      price: "29",
      privacy: "Private",
      privacy_message: "Only you can see the images you generated."
    },
    {
      title: "Annual offer",
      card_type: "annual_subscription",
      subtitle_info:
        "Best value per image. Extras are billed per pay-as-you-go plan.",
      quota: "2160",
      price: "290",
      privacy: "Private",
      privacy_message: "Only you can see the images you generated."
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.container__wrapper}>
        <h2 className={styles.container__title}>
          Get the ideal plan for your needs
        </h2>
        <div className={styles.container__content}>
          <PricingCard data={data[0]} />
          <PricingCard data={data[1]} />
          <PricingCard data={data[2]} />
        </div>
        <p className={styles.container__subtitle}>
          For enterprise offers{" "}
          <Link href="/contact" className={styles.container__subtitle_link}>
            contact us
          </Link>
        </p>
      </div>
    </div>
  );
}
