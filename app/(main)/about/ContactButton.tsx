'use client'

import { Button } from '@/components/ui/button/Button'
import { useRouter } from 'next/navigation'


export default function ContactButton() {

    const router = useRouter()

    const handleNavigate = () => {
        router.push('/nomenclatures')
    }

    const handleScrollToContact = () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className='flex flex-row gap-2 w-full items-center justify-center'>

            <Button onClick={handleScrollToContact}>
                Свяжитесь с нами
            </Button>


            <Button variant='navigate' onClick={handleNavigate}>
                Выберите места
            </Button>

        </div >
    )
}
