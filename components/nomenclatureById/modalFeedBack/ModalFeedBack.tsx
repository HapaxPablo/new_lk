'use client'

import { ModalWrapper } from "@/components/modal/ModalWrapper"
import { Button } from "@/components/ui/button/Button"
import Feedback from "@/components/ui/forms/feedback/Feedback"
import { useModal } from "@/providers/modal/ModalProvider"

export default function ModalFeedBack() {

    const { openModal } = useModal('feedback')
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        openModal()
    }

    return (
        <>
            <Button onClick={handleClick}>Обратная связь</Button>
            <ModalWrapper id='feedback' title='Обратная связь'>
                <Feedback />
            </ModalWrapper>
        </>
    )
}
