import { Button } from '@/components/ui/button/Button'

export default function ContactButton({ className }: { className: string }) {
    return (
        <div className='flex flex-row gap-2 w-full items-center justify-center'>
            <a href="#contact" className={className}>
                <Button>
                    Свяжитесь с нами
                </Button>
            </a>
            <a href="/nomenclatures" className={className}>
                <Button>
                    Выберите места
                </Button>
            </a>
        </div>
    )
}
