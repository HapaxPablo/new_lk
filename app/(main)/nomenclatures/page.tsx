import { Pagination } from '@/components/pagination/Pagination';
import { SearchForm } from '@/components/search-form/SearchForm';
import { INomenclatureItem, INomenclatureResponse } from '@/types/nomenclature';

interface NomenclaturesPageProps {
  searchParams: {
    limit?: string;
    offset?: string;
    search?: string;
  };
}

export default async function NomenclaturesPage({
  searchParams,
}: NomenclaturesPageProps) {
  // Получаем параметры с await
  const params = await searchParams;
  const limit = Number(params.limit) || 10;
  const offset = Number(params.offset) || 0;
  const search = params.search || undefined;

  try {
    // Формируем URL для API
    const url = new URL('/api/nomenclatures', 'http://localhost:3000');
    url.searchParams.set('limit', String(limit));
    url.searchParams.set('offset', String(offset));
    if (search) url.searchParams.set('search', search);

    // Делаем запрос к API
    const response = await fetch(url.toString(), {
      next: { tags: ['nomenclatures'] },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch data');
    }

    const data: INomenclatureResponse = await response.json();

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Номенклатура</h1>
        
        <SearchForm initialSearch={search} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {data.nomenclatureList.map((item) => (
            <div
              key={item.id}
              className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
              {item.address && <p className="text-gray-600 mb-2">{item.address}</p>}
              <p className="text-gray-700">{item.description}</p>
            </div>
          ))}
        </div>
        
        <Pagination total={data.total} limit={limit} offset={offset} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching nomenclatures:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error instanceof Error ? error.message : 'Произошла ошибка'}
        </div>
      </div>
    );
  }
}