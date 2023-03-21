import { ICollection, IItem } from '@interfaces/shop';
import { ICollectionSalesVolume } from './../shop';
import { IPagingParams, IPagingResponse } from './paging';

export type IGetCollectionListParams = IPagingParams;

export interface IGetCollectionListResponse extends IPagingResponse {
  result: Array<ICollection>;
}

export interface IGetSalesVolumeResponse {
  volumns: Array<ICollectionSalesVolume>;
}

export interface IGetSaleVolumeQuery {
  dateRange?: string;
}
export type IGetItemListParams = IPagingParams;

export interface IGetItemListResponse extends IPagingResponse {
  result: Array<IItem>;
}
