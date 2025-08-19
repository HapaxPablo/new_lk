'use client'

import {
  ArticleDiv,
  Description,
  MapPlacement,
  ResponsibleCard,
  TabsWrapper,
} from '@/components/nomenclatureById'
import Slider from '@/components/slider/Slider'
import { Wrench, Radio, Megaphone, MapPin } from 'lucide-react'

const page = () => {
  return (
    <div className="flex flex-row gap-1 p-4  w-full h-full">
      <div className="flex flex-col gap-2 w-2/5 h-auto">
        <div className="w-full h-[45%] rounded-md shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <Slider
            width="100%"
            height="100%"
            autoPlay={true}
            autoPlayTime={1500}
          />
        </div>
        <div className="w-full h-auto">
          <Description />
        </div>
      </div>

      <div className="flex flex-col w-full bg-white overflow-y-auto rounded-md shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col gap-4 p-4">
          <h2 className="text-xl font-semibold text-[#1E3961]">
            Ответственный
          </h2>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
            style={{ gridTemplateRows: 'repeat(2, 1fr)' }}
          >
            <ResponsibleCard
              label="Бренд радио"
              icon={<Radio size={16} />}
              data="Михневич Н.С."
              color="bg-purple-100"
            />
            <ResponsibleCard
              label="Техника"
              icon={<Wrench size={16} />}
              data="Шилин Е.А."
              color="bg-green-100"
            />
            <ResponsibleCard
              label="Реклама"
              icon={<Megaphone size={16} />}
              data="Давыдова Вероника"
              color="bg-blue-100"
            />
            <ResponsibleCard
              label="Размещение"
              icon={<MapPin size={16} />}
              data="60 000 ₽/мес."
              color="bg-red-100"
            />
          </div>
        </div>
        <hr className="solid m-4" />
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-row items-center gap-12">
            <h2 className="text-xl font-semibold text-[#1E3961]">
              Место вещания
            </h2>
            <ArticleDiv article="5984" />
          </div>
          <MapPlacement lat={56.011152} lng={92.814753} />
        </div>
        <hr className="solid m-4" />
        <TabsWrapper />
      </div>
    </div>
  )
}

export default page
