/* eslint-disable @typescript-eslint/no-explicit-any */
import cn from 'classnames';
import dayjs from 'dayjs';
import debounce from 'lodash/debounce';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { toast } from 'react-hot-toast';
import copy from 'copy-to-clipboard';
import InfiniteScroll from 'react-infinite-scroll-component';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { Empty } from '@components/Collection/Empty';
import Button from '@components/Button';
import { Loading } from '@components/Loading';
import { LIMIT_PER_PAGE as LIMIT } from '@constants/dao';
import { ROUTE_PATH } from '@constants/route-path';
import { getDaoProjects, voteDaoProject } from '@services/request';
import { formatBTCPrice } from '@utils/format';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import { convertIpfsToHttp } from '@utils/image';
import { IconVerified } from '@components/IconVerified';
import { formatAddressDisplayName } from '@utils/format';
import useWindowSize from '@hooks/useWindowSize';

import SkeletonItem from '../SkeletonItem';
import s from './CollectionItems.module.scss';

interface CollectionItemsProps {
  className?: string;
}

export const CollectionItems = ({
  className,
}: CollectionItemsProps): JSX.Element => {
  const { mobileScreen } = useWindowSize();
  const router = useRouter();
  const {
    keyword = '',
    status = '',
    sort = '',
    seq_id = '',
    tab,
  } = router.query;
  let timeoutId = -1;

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [combineList, setCombineList] = useState<any>([]);
  const [totalPerPage, setTotalPerPage] = useState<number>(1);
  const [currentCursor, setCurrentCursor] = useState<string>('');

  const initData = async (): Promise<void> => {
    setIsLoaded(false);
    const collections = await getDaoProjects({
      seq_id,
      keyword,
      status,
      sort,
      limit: LIMIT,
    });
    setCombineList([...(collections?.result || [])]);
    setTotalPerPage(collections?.total || LIMIT);
    setIsLoaded(true);
    setCurrentCursor(collections?.cursor || '');
  };

  useEffect(() => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      initData();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [keyword, status, sort, seq_id, tab, timeoutId]);

  const fetchCombineList = async () => {
    try {
      setIsLoading(true);
      if (totalPerPage > LIMIT) {
        const nextCollections = await getDaoProjects({
          seq_id,
          keyword,
          status,
          sort,
          limit: LIMIT,
          cursor: currentCursor,
        });
        setTotalPerPage(nextCollections?.total || LIMIT);
        setCurrentCursor(nextCollections?.cursor || '');
        const newList = combineList.concat([
          ...(nextCollections?.result || []),
        ]);
        setCombineList(newList);
      }
    } catch (error) {
      // handle fetch data error here
    } finally {
      setIsLoading(false);
    }
  };

  const debounceFetchCombineList = debounce(fetchCombineList, 300);

  const getStatusProposal = (status: number) => {
    if (status === 0) {
      return (
        <span className={cn(s.collections_status, s.collections_voting)}>
          Voting
        </span>
      );
    }
    if (status === 1) {
      return (
        <span className={cn(s.collections_status, s.collections_executed)}>
          Executed
        </span>
      );
    }
    if (status === 2) {
      return (
        <span className={cn(s.collections_status, s.collections_defeated)}>
          Defeated
        </span>
      );
    }
    return <span className={s.collections_status}>Unknown</span>;
  };

  const submitVote = async (projectId: string, voteType: number) => {
    toast.remove();
    const result = await voteDaoProject(projectId, voteType);
    if (result?.status) {
      toast.success('Voted successfully');
      initData();
    } else {
      toast.error('Voted failed');
    }
  };

  // const goToCollectionPage = (tokenId: string): void => {
  //   router.push(`${ROUTE_PATH.GENERATIVE}/${tokenId}`);
  // };

  // const goToProfilePage = (walletAddress: string): void => {
  //   router.push(`${ROUTE_PATH.PROFILE}/${walletAddress}`);
  // };

  const copyLink = (id: string) => {
    copy(`${location.origin}${ROUTE_PATH.DAO}?seq_id=${id}&tab=0`);
    toast.remove();
    toast.success('Copied');
  };

  return (
    <div className={cn(className, s.collections)}>
      <Row className={s.items_projects}>
        {isLoaded === false ? (
          <Col xs={12}>
            {[...Array(LIMIT)].map((_, index) => (
              <SkeletonItem key={`token-loading-${index}`} />
            ))}
          </Col>
        ) : (
          <Col md={12}>
            <div className={cn(s.collections_header)}>
              <div
                className={cn(
                  'col-md-1 d-flex justify-content-start',
                  s.collections_id
                )}
              >
                {mobileScreen ? 'ID' : 'Proposal ID'}
              </div>
              <div
                className={cn(
                  'col-md-2 d-flex justify-content-start',
                  s.collections_img
                )}
              >
                Image
              </div>
              <div
                className={cn(
                  'col-md-2 d-flex justify-content-start',
                  s.collections_name
                )}
              >
                Collection
              </div>
              <div
                className={cn(
                  'col-md-1 d-flex justify-content-start',
                  s.collections_maxSupply
                )}
              >
                Max Supply
              </div>
              <div
                className={cn(
                  'col-md-1 d-flex justify-content-start',
                  s.collections_price
                )}
              >
                Price
              </div>
              <div
                className={cn(
                  'col-md-1 d-flex justify-content-start',
                  s.collections_artistWrapper
                )}
              >
                Artist
              </div>
              <div
                className={cn(
                  'col-md-1 d-flex justify-content-center',
                  s.collections_expiration
                )}
              >
                Expiration
              </div>
              <div
                className={cn(
                  'col-md-1 d-flex justify-content-start',
                  s.collections_statusWrapper
                )}
              >
                Status
              </div>
              <div className="col-md-2 invisible">Action</div>
            </div>

            {typeof isLoaded && combineList.length === 0 ? (
              <Empty content="No Data Available." />
            ) : (
              <InfiniteScroll
                className={s.collections_infinite}
                dataLength={combineList.length}
                next={debounceFetchCombineList}
                hasMore
                loader={
                  isLoading ? (
                    <div className={s.collections_loader}>
                      <Loading isLoaded={!isLoading} />
                    </div>
                  ) : null
                }
                endMessage={<></>}
              >
                {combineList?.map((item: any) => (
                  <div key={item.id} className={s.collections_row}>
                    <div
                      className={cn(
                        'col-md-1 d-flex justify-content-start',
                        s.collections_id
                      )}
                    >
                      {item?.seq_id}
                    </div>
                    <div
                      className={cn(
                        'col-md-2 d-flex justify-content-start',
                        s.collections_img
                      )}
                    >
                      <a
                        className={s.collections_link}
                        href={`${ROUTE_PATH.GENERATIVE}/${item?.project?.token_id}`}
                        target="_blank"
                      >
                        <Image
                          className={s.collections_pointer}
                          src={convertIpfsToHttp(item?.project?.thumbnail)}
                          width={mobileScreen ? 60 : 120}
                          height={mobileScreen ? 60 : 120}
                          alt={item?.project?.name}
                        />
                      </a>
                    </div>
                    <div
                      className={cn(
                        'col-md-2 d-flex justify-content-start',
                        s.collections_name
                      )}
                    >
                      <a
                        className={s.collections_link}
                        href={`${ROUTE_PATH.GENERATIVE}/${item?.project?.token_id}`}
                        target="_blank"
                      >
                        <span
                          className={cn(
                            s.collections_pointer,
                            s.collections_projectName
                          )}
                        >
                          {item?.project?.name}
                        </span>
                      </a>
                    </div>
                    <div
                      className={cn(
                        'col-md-1 d-flex justify-content-start',
                        s.collections_maxSupply
                      )}
                    >
                      {item?.project?.max_supply}
                    </div>
                    <div
                      className={cn(
                        'col-md-1 d-flex justify-content-start',
                        s.collections_price
                      )}
                    >
                      {formatBTCPrice(item?.project?.mint_price)} BTC
                    </div>
                    <div
                      className={cn(
                        'col-md-1 d-flex justify-content-start',
                        s.collections_artistWrapper
                      )}
                    >
                      <div className={s.collections_pointer}>
                        <a
                          className={s.collections_link}
                          href={`${ROUTE_PATH.PROFILE}/${
                            item?.user?.wallet_address_btc_taproot ||
                            item?.user?.wallet_address
                          }`}
                          target="_blank"
                        >
                          <span className={s.collections_artist}>
                            {item?.user?.profile_social?.twitterVerified && (
                              <span className={s.collections_artist_verified}>
                                <IconVerified width={16} height={16} />
                              </span>
                            )}
                            {item?.user?.display_name ||
                              formatAddressDisplayName(
                                item?.user?.wallet_address_btc_taproot
                              )}
                          </span>
                        </a>
                      </div>
                    </div>
                    <div
                      className={cn(
                        'col-md-1 d-flex justify-content-center',
                        s.collections_expiration
                      )}
                    >{`${dayjs(item?.expired_at).format('MMM DD')}`}</div>
                    <div
                      className={cn(
                        'col-md-1 d-flex justify-content-start',
                        s.collections_statusWrapper
                      )}
                    >
                      {getStatusProposal(item?.status)}
                    </div>
                    <div className="col-md-2 d-flex justify-content-end">
                      <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 100, hide: 200 }}
                        overlay={
                          <Tooltip id="play-tooltip">
                            <div className={s.collections_tooltip}>
                              Copy link to share this proposal
                            </div>
                          </Tooltip>
                        }
                      >
                        <div>
                          <span
                            className={s.collections_share}
                            onClick={() => copyLink(item?.seq_id)}
                          >
                            <SvgInset
                              className={s.icCopy}
                              size={16}
                              svgUrl={`${CDN_URL}/icons/ic-copy.svg`}
                            />
                          </span>
                        </div>
                      </OverlayTrigger>

                      {/* <Button
                        className={cn(s.collections_btn, s.collections_mr6)}
                        disabled={item?.action?.can_vote === false}
                        variant="outline-black"
                        onClick={() => submitVote(item?.id, 0)}
                      >
                        Against
                      </Button> */}
                      <Button
                        className={cn(s.collections_btn, s.collections_btnVote)}
                        disabled={item?.action?.can_vote === false}
                        onClick={() => submitVote(item?.id, 1)}
                      >
                        Vote ({item?.total_vote})
                      </Button>
                    </div>
                  </div>
                ))}
              </InfiniteScroll>
            )}
          </Col>
        )}
      </Row>
    </div>
  );
};

export default React.memo(CollectionItems);
