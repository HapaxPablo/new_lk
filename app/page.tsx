import '@/styles/global.scss'
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
      </div>
    </div>
  )
}
