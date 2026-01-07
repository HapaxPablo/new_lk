'use client'
import React, { useContext } from "react";
import { SliderContext } from "../Slider";
import styles from '../Slider.module.scss';
import Slide from "./Slide";

export default function SlidesList() {
    const { slideNumber, items } = useContext(SliderContext);

    return (
        <div
            className={styles.slider__list}
            // style={{
            //     transform: `translateX(-${slideNumber * 100}%)`,
            //     width: `${items.length * 10}%`
            // }}
        >
            {items.map((slide, index) => (
                slide.src && slide.src.trim() !== '' ? (
                    <Slide key={index} data={{ url: slide.src, title: slide.alt || '' }} />
                ) : null
            ))}
        </div>
    );
}