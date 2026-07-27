import { SearchForm } from '@/components/search-form/SearchForm'

export function BrandsFilterPanel() {
  return (
    <div className="mb-8 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
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
    </div>
  )
}
