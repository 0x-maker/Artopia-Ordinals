import React, { useState } from 'react';
import Table from '@components/Table';
import s from './styles.module.scss';
import { Loading } from '@components/Loading';
import { IItem } from '@interfaces/shop';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ellipsisCenterBTCAddress, formatBTCPrice } from '@utils/format';
import { getItemList, getOnSaleItemList } from '@services/shop';
import _uniqBy from 'lodash/uniqBy';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';
import { ROUTE_PATH } from '@constants/route-path';
import { useRouter } from 'next/router';
import useAsyncEffect from 'use-async-effect';
import { LOGO_MARKETPLACE_URL } from '@constants/common';
import { HOST_ORDINALS_EXPLORER } from '@constants/config';
import Link from 'next/link';

const TABLE_HEADINGS = [
  'Name',
  '1H volume',
  '1D volume',
  '7D volume',
  'Seller',
  'Buyer',
];

const LOG_PREFIX = 'ItemsTab';

const Items: React.FC = (): React.ReactElement => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Use only for first load
  const [itemList, setItemList] = useState<Array<IItem>>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (e.target) {
      (e.target as HTMLImageElement).src = LOGO_MARKETPLACE_URL;
    }
  };

  const tableData = itemList.map(item => {
    const seller = (): string => {
      if (item.sellerDisplayName) {
        return item.sellerDisplayName;
      }
      if (item.sellerAddress) {
        return ellipsisCenterBTCAddress({ str: item.sellerAddress });
      }
      return '—';
    };

    const buyer = (): string => {
      if (item.buyerDisplayName) {
        return item.buyerDisplayName;
      }
      if (item.buyerAddress) {
        return ellipsisCenterBTCAddress({ str: item.buyerAddress });
      }
      return '—';
    };

    return {
      id: item.inscription_id,
      config: {
        onClick: () => {
          router.push(`${ROUTE_PATH.LIVE}/${item.inscription_id}`);
        },
      },
      render: {
        name: (
          <div className={s.name}>
            <img
              className={s.projectThumbnail}
              src={`${HOST_ORDINALS_EXPLORER}/content/${item.inscription_id}`}
              alt={item.name}
              onError={handleImageError}
            />
            <div className={s.projectInfo}>
              <p>{item.name}</p>
              <p className={s.collectionName}>{`#${ellipsisCenterBTCAddress({
                str: item.inscription_id,
              })}`}</p>
            </div>
          </div>
        ),
        volume1h: (
          <div className={s.volume}>
            <span>
              {!item.volumeOneHour?.amount || item.volumeOneHour.amount === '0'
                ? '—'
                : `${formatBTCPrice(item.volumeOneHour.amount, '—')} BTC`}
            </span>
          </div>
        ),
        volume1d: (
          <div className={s.volume}>
            <span>
              {!item.volumeOneDay?.amount || item.volumeOneDay.amount === '0'
                ? '—'
                : `${formatBTCPrice(item.volumeOneDay.amount, '—')} BTC`}
            </span>
          </div>
        ),
        volume7d: (
          <div className={s.volume}>
            <span>
              {!item.volumeOneWeek?.amount || item.volumeOneWeek.amount === '0'
                ? '—'
                : `${formatBTCPrice(item.volumeOneWeek.amount, '—')} BTC`}
            </span>
          </div>
        ),
        seller: (
          <div className={s.owners}>
            <Link
              onClick={e => {
                e.stopPropagation();
              }}
              href={`${ROUTE_PATH.PROFILE}/${item.sellerAddress}`}
            >
              {seller()}
            </Link>
          </div>
        ),
        buyer: (
          <div className={s.owners}>
            <Link
              onClick={e => {
                e.stopPropagation();
              }}
              href={`${ROUTE_PATH.PROFILE}/${item.buyerAddress}`}
            >
              {buyer()}
            </Link>
          </div>
        ),
      },
    };
  });

  const handleFetchItems = async (): Promise<void> => {
    try {
      const newPage = page + 1;
      const { result: nonSaleResult } = await getItemList({
        limit: 50,
        page: newPage,
      });
      const { result: onSaleResult } = await getOnSaleItemList({
        limit: 50,
        page: newPage,
      });
      let newList = [...itemList];
      if (nonSaleResult && Array.isArray(nonSaleResult)) {
        newList = _uniqBy(
          [...newList, ...nonSaleResult],
          nft => nft.inscription_id
        );
      }
      if (onSaleResult && Array.isArray(onSaleResult)) {
        newList = _uniqBy(
          [...newList, ...onSaleResult],
          nft => nft.inscription_id
        );
      }
      if (nonSaleResult.length === 0 && onSaleResult.length === 0) {
        setHasMore(false);
      }
      setItemList(newList);
      setPage(newPage);
    } catch (err: unknown) {
      log('can not fetch data', LogLevel.ERROR, LOG_PREFIX);
    }
  };

  useAsyncEffect(async () => {
    await handleFetchItems();
    setIsLoading(false);
  }, []);

  return (
    <div className={s.item}>
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
          hasMore={hasMore}
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
