import { ReactNode } from "react";
import styles from './ResponsibleCard.module.scss'
interface ResponsibleCardProps {
    label: string;
    icon: ReactNode;
    data: string | number;
    color?: string; // цвет фона
}

export function ResponsibleCard({
    label,
    icon,
    data,
    color = "bg-gray-100"
}: ResponsibleCardProps) {
    return (
        <article
            className={`${styles.wrapper} shadow-sm hover:shadow-md transition-shadow ${color}`}
            aria-label={`Ответственный за ${label}`}
            title={`Ответственный за ${label}`}
        >
            <header className={styles.wrapper__header}>
                {icon}
                <h3 className="font-medium">{label}</h3>
            </header>
            <div className={styles.wrapper__content}>{data}</div>
        </article>
    );
};
