'use client'

import { ModalWrapper } from "@/components/modal/ModalWrapper"
import { Button } from "@/components/ui/button/Button"
import Feedback from "@/components/ui/forms/feedback/Feedback"
import { useModal } from "@/providers/modal/ModalProvider"
import styles from './ModalFeedback.module.scss'

type ModalFeedBackProps = {
    pathName?: string
    brandId?: string
    nomenclaturesIds?: string[]
}

export default function ModalFeedBack({ pathName, brandId, nomenclaturesIds }: ModalFeedBackProps) {

    const { openModal } = useModal('feedback')
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        openModal()
    }

    return (
        <>
            <Button onClick={handleClick} variant="feedback" className={styles.button}>
                Написать нам
            </Button>
            <ModalWrapper id='feedback' title='Обратная связь'>
                <Feedback brandId={brandId} nomenclaturesIds={nomenclaturesIds} pathName={pathName} />
            </ModalWrapper>
        </>
    )
}
