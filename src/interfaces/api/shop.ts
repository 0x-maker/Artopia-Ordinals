import { ICollection, IItem } from '@interfaces/shop';
import { IPagingParams, IPagingResponse } from './paging';

export type IGetCollectionListParams = IPagingParams;

export interface IGetCollectionListResponse extends IPagingResponse {
  result: Array<ICollection>;
}

export type IGetItemListParams = IPagingParams;

export interface IGetItemListResponse extends IPagingResponse {
  result: Array<IItem>;
}
