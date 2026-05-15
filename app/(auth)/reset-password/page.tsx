import dynamic from 'next/dynamic'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Восстановление пароля | Личный кабинет',
    robots: {
        index: false,
        follow: false,
        nocache: true,
    },
}
const ResetPassword = dynamic(
    () =>
        import('@/components/auth/reset-password/ResetPassword').then((mod) => ({
            default: mod.default,
        })),
    { ssr: false, loading: () => <div>Loading...</div> }
)
export default function page() {
    return (
        <ResetPassword />
    )
}
