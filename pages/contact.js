import Head from "next/head";
import { useRef } from "react";
import styles from "../styles/Contact.module.scss";

export default function Contact() {
  const submissionMessageRef = useRef(null);

  function handleSubmissionMessage() {
    submissionMessageRef.current.innerHTML = "Message sent";

    setTimeout(() => {
      submissionMessageRef.current.innerHTML = "";
    }, 3500);
  }

  return (
    <>
      <Head>
        <title>Paintmuse - Contact</title>
        <meta name="contact" content="" />
      </Head>
      <div className={styles.container}>
        <div className={styles.container__content}>
          <h1 className={styles.container__title}>Contact us</h1>
          <form
            name="contact"
            method="POST"
            action="https://formsubmit.co/188540431f39e69cdf5444a12e335bcd"
            className={styles.container__form}
            onSubmit={handleSubmissionMessage}
          >
            <input
              className={styles.container__input}
              type="text"
              name="name"
              placeholder="Your name"
              required
            />
            <input
              className={styles.container__input}
              type="email"
              name="email"
              placeholder="Your email"
              required
            />
            <textarea
              className={styles.container__message}
              type="text"
              name="message"
              placeholder="Your message"
              required
            ></textarea>
            <div className={styles.container__submit_wrapper}>
              <span
                className={styles.container__submission_message}
                ref={submissionMessageRef}
              ></span>
              <button className={styles.container__submit} type="submit">
                Send
              </button>
            </div>
            <input
              type="hidden"
              name="_next"
              value="https://paintmuse.com/contact"
            ></input>
          </form>
          {/* <div className={styles.container__info}>
            <ul className={styles.container__info_list}>
              <li className={styles.container__info_item}>info@paintmuse.com</li>
              <li className={styles.container__info_item}>+44 20 4577 2359</li>
              <li className={styles.container__info_item_p_top_24}>SunChain LTD</li>
              <li className={styles.container__info_item}>128 City Road, London EC1V 2NX</li>
              <li className={styles.container__info_item}>Reg #: 14378160</li>
            </ul>
          </div> */}
        </div>
      </div>
    </>
  );
}
