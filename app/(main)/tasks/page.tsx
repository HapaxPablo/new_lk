import PageDevelop from '@/components/page-development/PageDevelop'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Задачи | Личный кабинет',
  robots: {
    index: false,
    follow: true,
  },
}
export default function TasksPage() {
  return <PageDevelop />
}
