import { LogLevel } from '@enums/log-level';
import { get } from '@services/http-client';
import log from '@utils/logger';
import {
  IListingTokensResponse,
  ITokenOfferListResponse,
  IMarketplaceStatsResponse,
  IMakeOffersParams,
  IMakeOffersQuery,
  IFirstSaleStatsResponse,
} from '@interfaces/api/marketplace';
import queryString from 'query-string';

const LOG_PREFIX = 'MarketplaceService';

const API_PATH = '/marketplace';

export const getListing = async (
  params: IMakeOffersParams,
  query: IMakeOffersQuery
): Promise<IListingTokensResponse> => {
  try {
    const qs = '?' + queryString.stringify(query);
    return await get<IListingTokensResponse>(
      `${API_PATH}/listing/${params.genNFTAddr}/token/${params.tokenId}${qs}`
    );
  } catch (err: unknown) {
    log('failed to get listing token', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get listing');
  }
};

export const getMakeOffers = async ({
  genNFTAddr,
  tokenId,
  closed = false,
}: IMakeOffersParams): Promise<ITokenOfferListResponse> => {
  try {
    return await get<ITokenOfferListResponse>(
      `${API_PATH}/offers/${genNFTAddr}/token/${tokenId}?closed=${closed}`
    );
  } catch (err: unknown) {
    log('failed to get listing token', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get listing');
  }
};

export const getListingTokensByWallet = async ({
  walletAddress,
  closed = false,
}: {
  walletAddress: string;
  closed: boolean;
}): Promise<IListingTokensResponse> => {
  try {
    return await get<IListingTokensResponse>(
      `${API_PATH}/wallet/${walletAddress}/listing?closed=${closed}`
    );
  } catch (err: unknown) {
    log('failed to get listing token', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get listing');
  }
};

export const getMakeOffersByWallet = async ({
  walletAddress,
  isNftOwner = false,
  closed = false,
}: {
  walletAddress: string;
  closed: boolean;
  isNftOwner: boolean;
}): Promise<ITokenOfferListResponse> => {
  try {
    return await get<ITokenOfferListResponse>(
      `${API_PATH}/wallet/${walletAddress}/offer?closed=${closed}&is_nft_owner=${isNftOwner}`
    );
  } catch (err: unknown) {
    log('failed to get listing token', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get listing');
  }
};

export const getMarketplaceStats = async ({
  collectionAddr,
}: {
  collectionAddr: string;
}): Promise<IMarketplaceStatsResponse | null> => {
  try {
    return await get<IMarketplaceStatsResponse>(
      `${API_PATH}/stats/${collectionAddr}`
    );
  } catch (err: unknown) {
    log('failed to get project stats', LogLevel.ERROR, LOG_PREFIX);
    return null;
  }
};

export const getFirstSaleStats = async ({
  projectID,
}: {
  projectID: string;
}): Promise<IFirstSaleStatsResponse | null> => {
  try {
    return await get<IFirstSaleStatsResponse>(
      `${API_PATH}/stats/${projectID}/first-sale`
    );
  } catch (err: unknown) {
    log('failed to get project first sale stats', LogLevel.ERROR, LOG_PREFIX);
    return null;
  }
};
