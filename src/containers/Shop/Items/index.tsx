import React, { useState } from 'react';
import Table from '@components/Table';
import s from './styles.module.scss';
import { Loading } from '@components/Loading';
import { IItem } from '@interfaces/shop';
import InfiniteScroll from 'react-infinite-scroll-component';
import { formatAddress, formatBTCPrice } from '@utils/format';
import { getItemList } from '@services/shop';
import _uniqBy from 'lodash/uniqBy';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';
import { ROUTE_PATH } from '@constants/route-path';
import { useRouter } from 'next/router';
import useAsyncEffect from 'use-async-effect';
import { LOGO_MARKETPLACE_URL } from '@constants/common';
import { HOST_ORDINALS_EXPLORER } from '@constants/config';

const TABLE_HEADINGS = [
  'Name',
  '1H volume',
  '1D volume',
  '7D volume',
  'Seller',
];

const LOG_PREFIX = 'ItemsTab';

const Items: React.FC = (): React.ReactElement => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Use only for first load
  const [itemList, setItemList] = useState<Array<IItem>>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

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
        return formatAddress(item.sellerAddress);
      }
      return '-';
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
              src={`${HOST_ORDINALS_EXPLORER}`}
              alt={item.name}
              onError={handleImageError}
            />
            <div className={s.projectInfo}>
              <p>{item.name}</p>
              <p className={s.collectionName}>{`#${item.inscription_id}`}</p>
            </div>
          </div>
        ),
        volume1h: (
          <div className={s.volume}>
            <span>
              {!item.volumeOneHour.amount || item.volumeOneHour.amount === '0'
                ? '—'
                : `${formatBTCPrice(item.volumeOneHour.amount, '—')} BTC`}
            </span>
          </div>
        ),
        volume1d: (
          <div className={s.volume}>
            <span>
              {!item.volumeOneDay.amount || item.volumeOneDay.amount === '0'
                ? '—'
                : `${formatBTCPrice(item.volumeOneDay.amount, '—')} BTC`}
            </span>
          </div>
        ),
        volume7d: (
          <div className={s.volume}>
            <span>
              {!item.volumeOneWeek.amount || item.volumeOneWeek.amount === '0'
                ? '—'
                : `${formatBTCPrice(item.volumeOneWeek.amount, '—')} BTC`}
            </span>
          </div>
        ),
        seller: <div className={s.owners}>{seller()}</div>,
      },
    };
  });

  const handleFetchItems = async (): Promise<void> => {
    try {
      const newPage = page + 1;
      const { result, total } = await getItemList({
        limit: 50,
        page: newPage,
      });
      if (result && Array.isArray(result)) {
        const newList = _uniqBy(
          [...itemList, ...result],
          nft => nft.inscription_id
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
