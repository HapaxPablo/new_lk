'use client'
import React, { useContext } from "react";
import { SliderContext } from '../../Slider';
import styles from '../../Slider.module.scss';

export default function Arrows() {
    const { changeSlide, isFirstSlide, isLastSlide, images } = useContext(SliderContext);
const showArrow = images.length <=1;
    return (
        <div className={styles.slider__arrows}>
            {!showArrow && 
            <button
                className={`${styles.slider__arrows__arrow} ${styles.slider__arrows__arrow__left} ${
                    isFirstSlide ? styles.slider__arrows__arrow__disabled : ''
                }`}
                onClick={() => !isFirstSlide && changeSlide(-1)}
                aria-label="Предыдущий слайд"
                disabled={isFirstSlide}
            />}
            {!showArrow && 
            <button
                className={`${styles.slider__arrows__arrow} ${styles.slider__arrows__arrow__right} ${
                    isLastSlide ? styles.slider__arrows__arrow__disabled : ''
                }`}
                onClick={() => !isLastSlide && changeSlide(1)}
                aria-label="Следующий слайд"
                disabled={isLastSlide}
            />}
        </div>
    );
}