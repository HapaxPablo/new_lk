import React from "react";

import styles from '../Slider.module.scss';
import Image from "next/image";

export default function SlideImage({ src, alt }: { src: string | null, alt: string }) {
    if (!src || src.trim() === '') {
        return null;
    }
    return (
        <div className={styles.slider__list__slide__image}>
            <Image
                src={src}
                alt={alt}
                width={800}
                height={600}
                sizes="(max-width: 600px) 100vw, 600px"
                loading="lazy"
            />
        </div>
    );
}