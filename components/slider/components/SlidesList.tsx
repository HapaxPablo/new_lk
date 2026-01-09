'use client'
import React, { useContext } from "react";
import { SliderContext } from "../Slider";
import styles from '../Slider.module.scss';
import Slide from "./Slide";

export default function SlidesList() {
    const { slideNumber, images } = useContext(SliderContext);

    return (
        <div
            className={styles.slider__list}
            style={{
                transform: `translateX(-${slideNumber * 100}%)`,
            }}
        >
            {images.map((slide, index) => (
                slide.source && slide.source.trim() !== '' ? (
                    <Slide 
                        key={index} 
                        data={{ 
                            url: slide.source, 
                            title: slide.source.split('/').pop() || `Изображение ${index + 1}` 
                        }} 
                    />
                ) : null
            ))}
        </div>
    );
}