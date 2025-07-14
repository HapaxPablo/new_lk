export interface INomenclatureItem {
  id: string;
  name: string;
  address: string;
  description: string;
  //TODO Паша сделай типы как надо
}

export interface INomenclatureResponse {
  nomenclatureList: INomenclatureItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface INomenclatureQueryParams {
  limit?: number;
  offset?: number;
  search?: string;
}