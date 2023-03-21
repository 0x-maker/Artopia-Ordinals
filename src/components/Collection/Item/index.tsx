import Heading from '@components/Heading';
import Text from '@components/Text';
import { LOGO_MARKETPLACE_URL, URL_PARAMS_PRO_MODE } from '@constants/common';
import { ROUTE_PATH } from '@constants/route-path';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import Link from '@components/Link';
import ButtonBuyListedFromBTC from '@components/Transactor/ButtonBuyListedFromBTC';
import { GLB_EXTENSION } from '@constants/file';
import { SATOSHIS_PROJECT_ID } from '@constants/generative';
import useWindowSize from '@hooks/useWindowSize';
import { Token } from '@interfaces/token';
import { ellipsisCenter, formatAddress } from '@utils/format';
import cs from 'classnames';
import React, {
  SyntheticEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Stack } from 'react-bootstrap';
import s from './styles.module.scss';
import ButtonBuyListedFromETH from '@components/Transactor/ButtonBuyListedFromETH';
import usePurchaseStatus from '@hooks/usePurchaseStatus';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import { useRouter } from 'next/router';

const CollectionItem = ({
  data,
  className,
  showCollectionName,
  total,
  layout = 'mint',
}: {
  data: Token;
  className?: string;
  showCollectionName?: boolean;
  total?: string | number;
  layout?: 'mint' | 'shop';
}) => {
  const router = useRouter();

  const tokenID = data.tokenID;
  const showInscriptionID =
    data.genNFTAddr === '1000012' && !!data.inscriptionIndex && !!total;

  const { mobileScreen } = useWindowSize();
  const {
    isWhitelistProject,
    isLayoutShop,
    selectedOrders,
    removeSelectedOrder,
    addSelectedOrder,
    isProMode,
    projectData,
  } = useContext(GenerativeProjectDetailContext);

  const { isWaiting, isBuyETH, isBuyBTC, isBuyable } = usePurchaseStatus({
    buyable: data?.buyable,
    isVerified: data?.sell_verified,
    orderID: data?.orderID,
    priceBTC: data?.priceBTC,
    priceETH: data?.priceETH,
  });

  const imgRef = useRef<HTMLImageElement>(null);

  const isSelectedOrder = selectedOrders.includes(data.orderID);

  const [thumb, setThumb] = useState<string>(data.image);

  const onThumbError = () => {
    setThumb(LOGO_MARKETPLACE_URL);
  };

  useEffect(() => {
    const fileExt = data.image.split('.').pop();
    if (fileExt && fileExt === GLB_EXTENSION && data.thumbnail) {
      setThumb(data.thumbnail);
    }
  }, [data.image]);

  const handleOnImgLoaded = (
    evt: React.SyntheticEvent<HTMLImageElement>
  ): void => {
    const img = evt.target as HTMLImageElement;
    const naturalWidth = img.naturalWidth;
    if (naturalWidth < 100 && imgRef.current) {
      imgRef.current.style.imageRendering = 'pixelated';
    }
  };

  const tokenUrl = useMemo(() => {
    if (isWhitelistProject)
      return `${ROUTE_PATH.GENERATIVE}/${SATOSHIS_PROJECT_ID}/${tokenID}`;
    return `${ROUTE_PATH.GENERATIVE}/${data.project.tokenID}/${tokenID}`;
  }, [isWhitelistProject, tokenID, data.project.tokenID]);

  const onSelectItem = () => {
    if (isBuyable && layout === 'shop') {
      isSelectedOrder
        ? removeSelectedOrder(data.orderID)
        : addSelectedOrder(data.orderID);
    } else {
      router.push(tokenUrl);
    }
  };

  const renderBuyButton = () => {
    if (!isBuyable) return null;
    return (
      <div className={s.row}>
        {isBuyBTC && (
          <ButtonBuyListedFromBTC
            className={isLayoutShop ? s.wrapButtonShop : s.wrapButton}
            sizes={isLayoutShop ? 'small' : 'medium'}
            inscriptionID={tokenID}
            price={data.priceBTC}
            inscriptionNumber={Number(data.inscriptionIndex || 0)}
            orderID={data.orderID}
            isShopLayout={isProMode}
          />
        )}
        {isBuyETH && (
          <ButtonBuyListedFromETH
            className={isLayoutShop ? s.wrapButtonShop : s.wrapButton}
            sizes={isLayoutShop ? 'small' : 'medium'}
            inscriptionID={tokenID}
            price={data.priceETH}
            inscriptionNumber={Number(data.inscriptionIndex || 0)}
            orderID={data.orderID}
            isShopLayout={isProMode}
          />
        )}
      </div>
    );
  };

  const renderHeadDesc = () => {
    const text = data?.orderInscriptionIndex
      ? data?.orderInscriptionIndex
      : data?.inscriptionIndex
      ? data?.inscriptionIndex
      : ellipsisCenter({
          str: tokenID,
          limit: 3,
        });
    if (showInscriptionID) {
      return (
        <span
          className={s.textOverflow_customDesc}
        >{`${data?.orderInscriptionIndex} / ${total}`}</span>
      );
    }
    if (isProMode)
      return (
        <div
          onClick={(event: SyntheticEvent) => {
            if (event.stopPropagation) {
              event.stopPropagation();
            }
          }}
          className={s.tokenNumber}
        >
          <Link href={`${tokenUrl}${URL_PARAMS_PRO_MODE}`}>
            <Text fontWeight="medium">
              {projectData?.name} #{text}
            </Text>
          </Link>
          <Text fontWeight="medium" color="black-40">
            Inscription #
            {data?.inscriptionIndex ||
              ellipsisCenter({
                str: tokenID,
                limit: 3,
              })}
          </Text>
        </div>
      );

    return (
      <div
        onClick={(event: SyntheticEvent) => {
          if (event.stopPropagation) {
            event.stopPropagation();
          }
        }}
      >
        <Link
          href={tokenUrl}
          className={layout === 'shop' ? s.tokenNumber : ''}
        >
          <Heading as={isLayoutShop ? 'p' : 'h4'}>
            {projectData?.name} #{text}
          </Heading>
          <Text fontWeight="medium" size="20" color="black-40">
            Inscription #
            {data?.inscriptionIndex ||
              ellipsisCenter({
                str: tokenID,
                limit: 3,
              })}
          </Text>
        </Link>
      </div>
    );
  };

  const ComponentLink = ({
    isDiv,
    children,
  }: {
    isDiv: boolean;
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    children: any;
  }) => {
    return isDiv ? (
      <div onClick={onSelectItem}>{children}</div>
    ) : (
      <Link className={s.collectionCard_inner} href={tokenUrl}>
        {children}
      </Link>
    );
  };

  return (
    <div
      className={`${s.collectionCard} ${className} ${
        isLayoutShop ? s.isShop : ''
      }`}
    >
      <div
        className={cs(
          s.collectionCard_inner_wrapper,
          isSelectedOrder ? s.isSelected : null
        )}
      >
        <ComponentLink isDiv={!!(isBuyable && layout === 'shop')}>
          <div
            className={`${s.collectionCard_thumb} ${
              thumb === LOGO_MARKETPLACE_URL ? s.isDefault : ''
            }`}
          >
            {isBuyable && layout === 'shop' && (
              <SvgInset
                className={s.collectionCard_thumb_selectIcon}
                size={14}
                svgUrl={`${CDN_URL}/icons/${
                  isSelectedOrder ? 'ic_checkboxed' : 'ic_checkbox'
                }.svg`}
              />
            )}
            <div className={s.collectionCard_thumb_inner}>
              <img
                onError={onThumbError}
                src={thumb}
                alt={data.name}
                loading={'lazy'}
                ref={imgRef}
                onLoad={handleOnImgLoaded}
              />
            </div>
          </div>
          {mobileScreen ? (
            <div className={cs(s.collectionCard_info, s.mobile)}>
              <Text size="11" fontWeight="medium">
                {data?.owner?.displayName ||
                  formatAddress(
                    data?.owner?.walletAddressBtcTaproot ||
                      data?.ownerAddr ||
                      ''
                  )}
              </Text>
              <div className={s.collectionCard_info_title}>
                <Text
                  className={s.textOverflow}
                  size="14"
                  fontWeight="semibold"
                >
                  <span
                    title={data?.project?.name}
                    className={s.collectionCard_info_title_name}
                  >
                    {isWaiting
                      ? 'Incoming... ' + (data?.project?.name || '')
                      : ''}
                  </span>
                  {renderHeadDesc()}
                </Text>
                {showInscriptionID && (
                  <Text
                    className={s.textOverflow}
                    fontWeight="semibold"
                    size="14"
                    style={{ marginBottom: 4 }}
                  >
                    #{data?.inscriptionIndex}
                  </Text>
                )}
                {renderBuyButton()}
              </div>
            </div>
          ) : (
            <div className={cs(s.collectionCard_info, s.desktop)}>
              <div className={s.collectionCard_info_title}>
                {isWaiting && (
                  <Heading
                    as={'h6'}
                    fontWeight="medium"
                    className={s.collectionCard_info_wrapper_waiting}
                  >
                    Incoming...
                  </Heading>
                )}
                <Stack
                  className={cs(s.collectionCard_info_stack, {
                    [s.collectionCard_info_wrapper]:
                      showCollectionName && data?.project?.name,
                  })}
                  direction="horizontal"
                >
                  <Heading
                    as={'h4'}
                    className={`token_id ml-auto ${s.textOverflow}`}
                    style={{
                      maxWidth: data.stats?.price ? '70%' : '100%',
                    }}
                  >
                    {renderHeadDesc()}
                  </Heading>
                  {showCollectionName && data?.project?.name && (
                    <div className={s.collectionCard_info_wrapper_ownerName}>
                      {data?.project?.name}
                    </div>
                  )}
                  <div
                    className={cs(
                      data?.creator?.displayName && s.collectionCard_info_artist
                    )}
                  >
                    {data?.creator?.displayName && (
                      <div className={s.collectionCard_info_artist_name}>
                        {data?.creator?.displayName}
                      </div>
                    )}
                  </div>
                </Stack>
                {showInscriptionID && (
                  <Heading
                    as={isLayoutShop ? 'p' : 'h4'}
                    className={`token_id ml-auto ${s.textOverflow}`}
                  >
                    #{data?.inscriptionIndex}
                  </Heading>
                )}
                {renderBuyButton()}
              </div>
            </div>
          )}
        </ComponentLink>
      </div>
    </div>
  );
};

export default CollectionItem;
