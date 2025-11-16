import {estypes} from '@elastic/elasticsearch';

export interface IPaginateProps {
  search_after?: [number, number]
  from?: number;
  size: number;
  type: string;
}

export interface ISearchResult<T = unknown> {
  hits: estypes.SearchHit<T>[];
  total: number;
  aggs?: Record<string, unknown>;
  highlights?: Record<string, string[]>[];
}

export interface ISearchResponse<T = unknown> {
  hits: T[];
  total: number;
}

export interface ISearchOptions {
  query: estypes.QueryDslQueryContainer;
  from?: number;
  size?: number;
  sort?: estypes.SortCombinations[];
  search_after?: estypes.SortResults,
  _source?: string[] | boolean;
  aggs?: Record<string, estypes.AggregationsAggregationContainer>;
  highlight?: estypes.SearchHighlight;
  track_total_hits?: boolean | number;
}

export interface ISearchParams {
  keyword: string;
  seller: string;
  categories: string[];
  subCategories: string[];
  tags: string[];
  paginate: IPaginateProps;
  priceMin?: number;
  priceMax?: number;
  expectedDeliveryDays?: number;
  excludeSellers: string[]
  sort: {
    by: string;
    order: string;
  }
}
