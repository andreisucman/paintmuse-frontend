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
      pricePerImage: "0.45",
      extrasPrice: null,
      privacy: "Public",
      privacy_message: "Everyone can see the images you generated.",
      priceId: "price_1M8hiyFOIAGAaeVifGD1zRTR",
    },
    {
      title: "Monthly saving",
      subtitle_info:
        "Better value per image. Extra images are billed per discounted prepaid flexible plan.",
      quota: "90",
      price: "29",
      extrasPrice: "0.40",
      privacy: "Private",
      privacy_message: "Only you can see the images you generated.",
      priceId: "price_1M8ht9FOIAGAaeVilWOZlv9O",
    },
    {
      title: "Annual deal",
      subtitle_info:
        "Best value per image. Extra images are billed per monthly saving plan.",
      quota: "2160",
      price: "290",
      extrasPrice: "0.32",
      privacy: "Private",
      privacy_message: "Only you can see the images you generated.",
      priceId: "price_1M8i6tFOIAGAaeViafj6h8oL",
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
