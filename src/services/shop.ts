import {
  IGetCollectionListParams,
  IGetCollectionListResponse,
  IGetSalesVolumeResponse,
  IGetSaleVolumeQuery,
} from '@interfaces/api/shop';
import { get } from './http-client';
import querystring from 'query-string';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';

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
