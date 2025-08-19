import { Button } from '@/components/ui/button/Button';
import { SliderContext } from '../../Slider';
import styles from '../../Slider.module.scss';

import React, { useContext } from "react";


export default function Arrows() {
    const { changeSlide } = useContext(SliderContext);

    return (
        <div className={styles.slider__arrows}>
            <button
                className={styles.slider__arrows__arrow__left}
                onClick={() => changeSlide(-1)}
                aria-label="Предыдущий слайд"
            />
            <button
                className={styles.slider__arrows__arrow__right}
                onClick={() => changeSlide(1)}
                aria-label="Следующий слайд"
            />
        </div>
    );
}