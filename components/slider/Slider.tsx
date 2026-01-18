import dynamic from 'next/dynamic'
import { IImage } from '@/types/nomenclature'

interface ISliderProps {
  autoPlay: boolean
  autoPlayTime: number
  width?: string | number
  height?: string | number
  images?: IImage[]
}

// Динамически импортируем клиентский компонент без SSR
const SliderClient = dynamic(() => import('./SliderClient'), {
  ssr: true,
  loading: () => (
    <div style={{ width: '100%', height: '100%', minHeight: '300px' }}>
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-md">
        <div className="animate-pulse">
          <div className="h-48 w-full bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  ),
})

const Slider = function (props: ISliderProps) {
  return <SliderClient {...props} />
}

export default Slider
export type { ISliderProps }