import React from 'react'
import styles from './ArticleDiv.module.scss'
interface ArticleDivProps {
    article: number | string,
}

export function ArticleDiv({ article }: ArticleDivProps) {
    return (
        <label
            className={styles.wrapper}
            aria-label={`Номер ${article} тачки(пк) вещания трансляции`}
            title={`Номер ${article} тачки(пк) вещания трансляции`}
        >
            {article}
        </label>
    )
}
