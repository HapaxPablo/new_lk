import dynamic from 'next/dynamic'

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
