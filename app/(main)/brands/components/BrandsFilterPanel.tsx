import { SearchForm } from '@/components/search-form/SearchForm'
import { EntityCard } from '@/components/ui/card/EntityCard'

export function BrandsFilterPanel() {
  return (
    <EntityCard as="section" className="mb-8">
      <div className="p-4">
        <SearchForm
          placeholder="Введите название бренда"
          hideButton
          inputClassName="border-white/20"
        />
      </div>

      {/*
        TODO: в макете (new_brands_list.html) в этом блоке также есть:
        - select "Город"
        - select "Тип бренда"
        - select "Сортировка" (по популярности / по кол-ву точек / по алфавиту)
        - быстрые чипсы-фильтры ("Торговые центры", "Красноярск", "Аудиореклама")
        Всё это требует новых queryparams (city, type_of_brand, sort) в
        app/api/brands/assigned/route.ts и на стороне 1С API — сейчас там
        принимаются только limit, offset и search, поэтому эти элементы не добавлены.
      */}
    </EntityCard>
  )
}
