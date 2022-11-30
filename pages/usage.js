import Head from "next/head";
import ToTopButton from "../components/common/ToTopButton";
import Link from "next/link";
import styles from "../styles/Legal.module.scss";

export default function Usage() {
  return (
    <>
      <Head>
        <title>Paintmuse - Usage policy</title>
        <meta name="usage policy" content="" />
      </Head>
      <main className={styles.legal}>
        <div className={styles.legal__wrapper}>
          <h1 className={styles.legal__title}>Usage Policy</h1>
          <div className={styles.legal__container}>
            <p className={styles.legal__paragraph}>
              We want everyone to use our service safely and responsively. By
              that we mean only generating content that is safe and does not
              violate anyone's rights. Below you can see the types of content
              that all of our users must avoid to keep their account active.
            </p>
            <ul className={styles.legal__list}>
              <li className={styles.legal__item}>
                <u>Hate:</u> Content expresses, incites, or promotes hate based
                on identity.
              </li>
              <li className={styles.legal__item}>
                <u>Harrasment:</u> content that intends to harrass, threaten or
                bully an individual.
              </li>
              <li className={styles.legal__item}>
                <u>Violence:</u> Content that promotes or glorifies violence or
                celebrates the suffering or humiliation of others
              </li>
              <li className={styles.legal__item}>
                <u>Self-harm:</u> Content that promotes, encourages, or depicts
                acts of self-harm, such as suicide, cutting, and eating
                disorders
              </li>
              <li className={styles.legal__item}>
                <u>Sexual:</u> Content meant to arouse sexual excitement, such
                as the description of sexual activity, or that promotes sexual
                services (excluding sex education and wellness)
              </li>
              <li className={styles.legal__item}>
                <u>Political:</u> Content attempting to influence the political
                process or to be used for campaigning purposes.
              </li>
              <li className={styles.legal__item}>
                <u>Deception:</u> Content that is false or misleading, such as
                attempting to defraud individuals or spread disinformation
              </li>
            </ul>
            <p className={styles.legal__paragraph}>
              Accounts found to be creating such content will be banned. If you
              believe that your account has been mistakenly suspended due to a
              violation of this policy, please send us a message using the {" "} 
              <Link href="/contact"><b>contact
              form</b></Link>.
            </p>

            <p className={styles.legal__paragraph}>
              <i>Last updated: 30 November 2022</i>
            </p>
          </div>
        </div>
      </main>
      <ToTopButton />
    </>
  );
}
