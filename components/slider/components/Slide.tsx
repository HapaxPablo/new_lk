import React from "react";
import styles from '../Slider.module.scss';
import SlideImage from "./SlideImage";
import SlideTitle from "./SlideTitle";

export default function Slide({ data: { url, title } }: { data: { url: string | null, title: string } }) {
    return (
        <div className={styles.slider__list__slide}>
            <SlideImage src={url} alt={title} />
            <SlideTitle title={title} />
        </div>
    );
}

