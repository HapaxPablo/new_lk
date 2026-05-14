import styles from './FooterMobile.module.scss'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, Terminal } from 'lucide-react'
import MapLink from '../MapLink'



type FooterMobileProps = {
    currentYear: number
}

export default function FooterMobile({ currentYear }: FooterMobileProps) {
    return (
        <footer
            className={styles.footer}
            itemScope
            itemType="https://schema.org/Organization"
        >
            <div className={styles.footer__container}>
                <meta itemProp="name" content="ООО АРЭМСИ 24" />
                <meta itemProp="brand" content="RMC" />
                <meta itemProp="email" content="info@krasrm.com" />
                <meta itemProp="telephone" content="+78005005050" />

                <div className={styles.footer__brand}>
                    <Link
                        href="/about"
                        className={styles.footer__logo}
                        aria-label="RMC Home"
                        itemProp="url"
                    >
                        <Image
                            src="/logo_footer.svg"
                            alt="RMC Logo"
                            width={60}
                            height={24}
                            className={styles.footer__logoImage}
                            priority
                            title="логотип-rmc"
                            aria-label="logo"
                            itemProp="logo"
                        />
                    </Link>

                    <address itemScope itemType="https://schema.org/LocalBusiness">
                        <div className={styles.footer__contacts}>
                            <div className={styles.footer__contact} itemProp="email">
                                <Mail size={16} />
                                <span itemProp="email">
                                    <a
                                        href="mailto:info@krasrm.com"
                                        className={styles.footer__link}
                                        aria-label="Написать на почту"
                                        itemProp="email"
                                    >
                                        info@krasrm.com
                                    </a>
                                </span>
                            </div>
                            <div className={styles.footer__contact} itemProp="telephone">
                                <Phone size={16} />
                                <span itemProp="telephone">
                                    <a
                                        href="tel:+78005005050"
                                        className={styles.footer__link}
                                        aria-label="Позвонить по телефону"
                                        itemProp="telephone"
                                    >
                                        8 800 222 59 38
                                    </a>
                                </span>
                            </div>
                        </div>
                    </address>
                </div>
                <div
                    className={styles.footer__legal}
                    itemProp="address"
                    itemScope
                    itemType="https://schema.org/PostalAddress"
                >
                    <MapLink />
                </div>
                <div className={styles.footer__copyright}>
                    <span itemProp="name">
                        <a href="/accreditation" itemProp="url" className={`${styles.footer__link} underline!`}>
                            ООО "АРЭМСИ 24"
                        </a>
                    </span>
                    <span>© 2022-{currentYear} RMC Technologies</span>
                </div>
            </div>
        </footer>
    )
}
