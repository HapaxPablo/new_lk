'use client'
import ErrorPage from "@/components/ui/error/ErrorPage";
interface ErrorProps {
    error: Error
}

export default function Error({ error }: ErrorProps) {
    return <ErrorPage error={error} />
}