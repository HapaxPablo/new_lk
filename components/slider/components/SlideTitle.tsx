import React from "react";
import styles from '../Slider.module.scss';

export default function SlideTitle({ title }: { title: string }) {
    return (
        <>
            {title && (
                <div className={styles.slider__list__slide__title}>{title}</div>
            )}
        </>
    )
}