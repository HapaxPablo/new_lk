import { ComponentProps } from 'react'
import styles from './SearchClient.module.scss'

interface SearchClientProps extends ComponentProps<'input'> {
    placeholder?: string
}

export default function SearchClient({ ...props }: SearchClientProps) {
    return (
        <input className={styles.inputSearch} {...props} />
    )
}
