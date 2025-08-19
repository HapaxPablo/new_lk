import React, { useContext } from "react";
import { SliderContext } from "../../Slider";
import styles from '../../Slider.module.scss';

export default function Dot({ number }: { number: number }) {
    const { goToSlide, slideNumber } = useContext(SliderContext);

    return (
        <div
            className={`${styles.slider__dots__dot} ${slideNumber === number ? styles.slider__dots__dot__selected : ""}`}
            onClick={() => goToSlide(number)}
        />
    );
}