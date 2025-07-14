import { SearchForm } from '@/components/search-form/SearchForm'
import Card from '@/components/ui/card/Card'
import { Loader } from '@/components/ui/loader/Loader'
import { Suspense } from 'react'

export default function Home() {
  return (
    <div>
      Test
      <button className="btn">button</button>
      <button className="btn-outline">button-outline</button>
      <button className="btn-primary">button-primary</button>
      <div className="card bg-primary m-2">
        <div className="p-2">test</div>
        <div className="bg-accent p-2">test</div>
      </div>
      <div className="p-2 flex flex-col gap-2">
        <input className="input" />
        <select className="select" />
        <textarea className="textarea" />
        <Suspense fallback={<div>Loading search form...</div>}>
          <SearchForm hideButton />
        </Suspense>
      </div>
      <div className="flex flex-row gap-10">
        <Loader size="small" variant="primary" />

        <Loader size="medium" variant="success" />

        <Loader size="large" variant="error" />

        <Loader size="large" variant="warning" />
      </div>
      <div className="w-full h-full p-2">
        <Card />
      </div>
    </div>
  )
}
