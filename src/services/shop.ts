import { LogLevel } from '@enums/log-level';
import {
  IGetCollectionListParams,
  IGetCollectionListResponse,
  IGetItemListParams,
  IGetItemListResponse,
  IGetSaleVolumeQuery,
  IGetSalesVolumeResponse,
} from '@interfaces/api/shop';
import log from '@utils/logger';
import querystring from 'query-string';
import { get } from './http-client';

const LOG_PREFIX = 'ShopService';
const API_PATH = '/collections';

export const getCollectionList = async (
  params: IGetCollectionListParams
): Promise<IGetCollectionListResponse> => {
  try {
    const qs = '?' + querystring.stringify(params);
    const res = await get<IGetCollectionListResponse>(`${API_PATH}${qs}`);
    return res;
  } catch (err: unknown) {
    log(
      `failed to get shop collection list ${JSON.stringify(params)}`,
      LogLevel.ERROR,
      LOG_PREFIX
    );
    log(err as Error, LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get shop collection list');
  }
};

export const getSalesVolume = async (
  { projectID }: { projectID: string },
  query: IGetSaleVolumeQuery
): Promise<IGetSalesVolumeResponse> => {
  try {
    const qs = '?' + querystring.stringify(query);
    const res = await get<IGetSalesVolumeResponse>(
      `/charts${API_PATH}/${projectID}${qs}`
    );
    return res;
  } catch (err: unknown) {
    log('failed to fetch sales volume data', LogLevel.ERROR, LOG_PREFIX);
    throw Error();
  }
};

export const getItemList = async (
  params: IGetItemListParams
): Promise<IGetItemListResponse> => {
  try {
    const qs = '?' + querystring.stringify(params);
    const res = await get<IGetItemListResponse>(`${API_PATH}/items${qs}`);
    return res;
  } catch (err: unknown) {
    log(
      `failed to get shop item list ${JSON.stringify(params)}`,
      LogLevel.ERROR,
      LOG_PREFIX
    );
    log(err as Error, LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get shop item list');
  }
};

export const getOnSaleItemList = async (
  params: IGetItemListParams
): Promise<IGetItemListResponse> => {
  try {
    const qs = '?' + querystring.stringify(params);
    const res = await get<IGetItemListResponse>(
      `${API_PATH}/on-sale-items${qs}`
    );
    return res;
  } catch (err: unknown) {
    log(
      `failed to get shop onsale item list ${JSON.stringify(params)}`,
      LogLevel.ERROR,
      LOG_PREFIX
    );
    log(err as Error, LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get shop onsale item list');
  }
};
