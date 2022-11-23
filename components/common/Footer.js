import styles from "../../styles/components/common/Footer.module.scss";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={styles.container}>
      <div className={styles.container__wrapper}>
        <ul className={styles.container__policies_list}>
          <li className={styles.container__policies_item}><Link href="/terms">Terms</Link></li>
          <li className={styles.container__policies_item}><Link href="/privacy">Privacy</Link></li>
          <li className={styles.container__policies_item}><Link href="/contact">Contact</Link></li>
        </ul>
        <p className={styles.container__copyright}>&copy;2022 Paintmuse. All rights reserved.</p>
      </div>
    </footer>
  )
}