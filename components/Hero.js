import styles from "../styles/components/Hero.module.scss";

export default function Hero() {
  return (
    <div className={styles.container}>
      <div className={styles.container__wrapper}>
        {/* <video className={styles.container__video} autoPlay muted loop>
          <source src={"/assets/bg_video.mp4"} />
        </video> */}
        <h1 className={styles.container__slogan}>
          Get inspiration from your imagination
        </h1>
        <h2 className={styles.container__slogan_description}>
          Boost your creativity with AI-generated mood boards
        </h2>
      </div>
    </div>
  );
}
