import FooterDesktop from "./desktop/FooterDesktop"
import FooterMobile from "./mobile/FooterMobile"
import styles from "./Footer.module.scss"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <>
      <div className={styles.footer_desktop}>
        <FooterDesktop currentYear={currentYear} />
      </div>
      <div className={styles.footer_mobile}>
        <FooterMobile currentYear={currentYear} />
      </div>
    </>
  )
}