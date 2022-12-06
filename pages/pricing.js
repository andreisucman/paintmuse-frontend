import styles from "../styles/Pricing.module.scss";
import PricingCard from "../components/PricingCard";
import Link from "next/link";

export default function Pricing() {
  const data = [
    {
      title: "Prepaid flexible",
      subtitle_info: "Add funds to your balance and pay per image.",
      quota: null,
      price: null,
      pricePerImage: "0.25",
      extrasPrice: null,
      privacy: "Public",
      privacy_message: "Everyone can see the images you generated.",
      priceId: process.env.NEXT_PUBLIC_PREPAID_PRICE_ID,
    },
    {
      title: "Monthly saving",
      subtitle_info:
        "Better value per image. Extra images are billed per discounted prepaid flexible plan.",
      quota: "90",
      price: "19",
      extrasPrice: "0.25",
      privacy: "Private",
      privacy_message: "Only you can see the images you generated.",
      priceId: process.env.NEXT_PUBLIC_MONTHLY_PRICE_ID,
    },
    {
      title: "Annual deal",
      subtitle_info:
        "Best value per image. Extra images are billed per monthly saving plan.",
      quota: "2160",
      price: "229",
      extrasPrice: "0.21",
      privacy: "Private",
      privacy_message: "Only you can see the images you generated.",
      priceId: process.env.NEXT_PUBLIC_ANNUAL_PRICE_ID,
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
