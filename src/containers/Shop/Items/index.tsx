import React, { useState } from 'react';
import Table from '@components/Table';
import s from './styles.module.scss';
import { Loading } from '@components/Loading';
import { ICollection } from '@interfaces/shop';
import InfiniteScroll from 'react-infinite-scroll-component';
import { formatBTCPrice } from '@utils/format';
import { getCollectionList } from '@services/shop';
import _uniqBy from 'lodash/uniqBy';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';
import Link from 'next/link';
import { ROUTE_PATH } from '@constants/route-path';
import { useRouter } from 'next/router';
import useAsyncEffect from 'use-async-effect';
import { LOGO_MARKETPLACE_URL } from '@constants/common';

const TABLE_HEADINGS = [
  'Name',
  'Price',
  '15M volume',
  '1D volume',
  '7D volume',
  'Seller',
];

const LOG_PREFIX = 'ItemsTab';

const Items: React.FC = (): React.ReactElement => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Use only for first load
  const [itemList, setItemList] = useState<Array<ICollection>>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (e.target) {
      (e.target as HTMLImageElement).src = LOGO_MARKETPLACE_URL;
    }
  };

  const tableData = itemList.map(collection => {
    return {
      id: collection.project.tokenId,
      config: {
        onClick: () => {
          router.push(`${ROUTE_PATH.GENERATIVE}/${collection.project.tokenId}`);
        },
      },
      render: {
        name: (
          <div className={s.name}>
            <img
              className={s.projectThumbnail}
              src={collection.project.thumbnail}
              alt={collection.project.name}
              onError={handleImageError}
            />
            <div className={s.projectInfo}>
              <Link
                onClick={(e: React.MouseEvent<HTMLAnchorElement>): void => {
                  e.stopPropagation();
                }}
                href={`${ROUTE_PATH.PROFILE}/${
                  collection.owner?.walletAddress_btc_taproot || ''
                }`}
                className={s.owner}
              >
                {collection.owner?.displayName}
              </Link>
              <p className={s.collectionName}>{collection.project.name}</p>
            </div>
          </div>
        ),
        price: (
          <div className={s.floorPrice}>
            <span>
              {formatBTCPrice(
                collection.projectMarketplaceData.floor_price,
                '—'
              )}{' '}
              {formatBTCPrice(
                collection.projectMarketplaceData.floor_price,
                '—'
              ) === '—'
                ? ''
                : 'BTC'}
            </span>
          </div>
        ),
        volume15m: (
          <div className={s.volume}>
            <span>
              {formatBTCPrice(collection.projectMarketplaceData.volume, '—')}{' '}
              {formatBTCPrice(collection.projectMarketplaceData.volume, '—') ===
              '—'
                ? ''
                : 'BTC'}
            </span>
          </div>
        ),
        volume1d: (
          <div className={s.volume}>
            <span>
              {formatBTCPrice(collection.projectMarketplaceData.volume, '—')}{' '}
              {formatBTCPrice(collection.projectMarketplaceData.volume, '—') ===
              '—'
                ? ''
                : 'BTC'}
            </span>
          </div>
        ),
        volume7d: (
          <div className={s.volume}>
            <span>
              {formatBTCPrice(collection.projectMarketplaceData.volume, '—')}{' '}
              {formatBTCPrice(collection.projectMarketplaceData.volume, '—') ===
              '—'
                ? ''
                : 'BTC'}
            </span>
          </div>
        ),
        seller: (
          <div className={s.owners}>
            {collection.project.mintingInfo.index.toLocaleString()}
          </div>
        ),
      },
    };
  });

  const handleFetchItems = async (): Promise<void> => {
    try {
      const newPage = page + 1;
      const { result, total } = await getCollectionList({
        limit: 50,
        page: newPage,
      });
      if (result && Array.isArray(result)) {
        const newList = _uniqBy(
          [...itemList, ...result],
          nft => nft.project.contractAddress + nft.project.tokenId
        );
        setItemList(newList);
      }
      setPage(newPage);
      setTotal(total);
    } catch (err: unknown) {
      log('can not fetch data', LogLevel.ERROR, LOG_PREFIX);
    }
  };

  useAsyncEffect(async () => {
    await handleFetchItems();
    setIsLoading(false);
  }, []);

  return (
    <div className={s.collection}>
      {isLoading && (
        <div className={s.loadingWrapper}>
          <Loading isLoaded={false} />
        </div>
      )}
      {!isLoading && (
        <InfiniteScroll
          dataLength={itemList.length}
          next={handleFetchItems}
          className={s.collectionScroller}
          hasMore={itemList.length < total}
          loader={
            <div className={s.scrollLoading}>
              <Loading isLoaded={false} />
            </div>
          }
          endMessage={<></>}
        >
          <Table
            responsive
            className={s.dataTable}
            tableHead={TABLE_HEADINGS}
            data={tableData}
          />
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Items;
