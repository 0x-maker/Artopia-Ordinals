import { Token } from '@interfaces/token';
import React, { SyntheticEvent, useContext, useMemo } from 'react';
import styles from './styles.module.scss';
import Link from '@components/Link';
import { ROUTE_PATH } from '@constants/route-path';
import { useRouter } from 'next/router';
import { ellipsisCenter, formatAddressDisplayName } from '@utils/format';
import ButtonBuyListedFromETH from '@components/Transactor/ButtonBuyListedFromETH';
import ButtonBuyListedFromBTC from '@components/Transactor/ButtonBuyListedFromBTC';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import usePurchaseStatus from '@hooks/usePurchaseStatus';
import Text from '@components/Text';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import { SATOSHIS_PROJECT_ID } from '@constants/generative';

type Props = {
  data: Token;
};

const ListViewItem = ({ data }: Props) => {
  const router = useRouter();

  const { projectID } = router.query;
  const tokenID = data.tokenID;

  const {
    isLayoutShop,
    selectedOrders,
    removeSelectedOrder,
    addSelectedOrder,
    isWhitelistProject,
    projectData,
  } = useContext(GenerativeProjectDetailContext);

  const { isBuyETH, isBuyBTC, isBuyable } = usePurchaseStatus({
    buyable: data?.buyable,
    isVerified: data?.sell_verified,
    orderID: data?.orderID,
    priceBTC: data?.priceBTC,
    priceETH: data?.priceETH,
  });

  const isSelectedOrder = selectedOrders.includes(data.orderID);

  const tokenUrl = useMemo(() => {
    if (isWhitelistProject)
      return `${ROUTE_PATH.GENERATIVE}/${SATOSHIS_PROJECT_ID}/${tokenID}`;
    return `${ROUTE_PATH.GENERATIVE}/${data.project.tokenID}/${tokenID}`;
  }, [isWhitelistProject, tokenID, data.project.tokenID]);

  const text = data?.orderInscriptionIndex
    ? data?.orderInscriptionIndex
    : data?.inscriptionIndex
    ? data?.inscriptionIndex
    : ellipsisCenter({
        str: tokenID,
        limit: 3,
      });

  const onSelectItem = () => {
    if (isBuyable) {
      isSelectedOrder
        ? removeSelectedOrder(data.orderID)
        : addSelectedOrder(data.orderID);
    }
  };

  const renderBuyButton = () => {
    if (!isBuyable) return null;
    return (
      <div className={`${styles.row} ${styles.buy_btn}`}>
        {isBuyBTC && (
          <Link
            href=""
            className={styles.btc_btn}
            onClick={() => {
              // DO NOTHING
            }}
          >
            <ButtonBuyListedFromBTC
              sizes={isLayoutShop ? 'xsmall' : 'medium'}
              inscriptionID={data.tokenID}
              price={data.priceBTC}
              inscriptionNumber={Number(data.inscriptionIndex || 0)}
              orderID={data.orderID}
            />
          </Link>
        )}
        {isBuyETH && (
          <Link
            href=""
            onClick={() => {
              // DO NOTHING
            }}
            className={styles.eth_btn}
          >
            <ButtonBuyListedFromETH
              sizes={isLayoutShop ? 'xsmall' : 'medium'}
              inscriptionID={data.tokenID}
              price={data.priceETH}
              inscriptionNumber={Number(data.inscriptionIndex || 0)}
              orderID={data.orderID}
            />
          </Link>
        )}
      </div>
    );
  };

  return (
    <tr className={`${isSelectedOrder ? 'isSelectedOrder' : ''}`}>
      <td className={styles.checkbox} onClick={onSelectItem}>
        {isBuyable && (
          <SvgInset
            className={isSelectedOrder ? styles.isChecked : ''}
            size={14}
            svgUrl={`${CDN_URL}/icons/${
              isSelectedOrder ? 'ic_checkboxed' : 'ic_checkbox'
            }.svg`}
          />
        )}
      </td>
      <td>
        <Link
          className={styles.itemInfo}
          href={`${ROUTE_PATH.GENERATIVE}/${projectID}/${data.tokenID}`}
        >
          <img
            className={styles.itemThumbnail}
            src={data?.thumbnail}
            alt={data?.name}
          />
          {/* <div className={styles.itemName}>
            <Link href="">
              <Text fontWeight="medium">
                #{data?.orderInscriptionIndex || data?.inscriptionIndex}
              </Text>
            </Link>
          </div> */}
          <div
            onClick={(event: SyntheticEvent) => {
              if (event.stopPropagation) {
                event.stopPropagation();
              }
            }}
            className={styles.itemName}
          >
            <Link href={tokenUrl}>
              <Text fontWeight="medium" color="white-100">
                {projectData?.name} #{text}
              </Text>
            </Link>
            <Text size="14" fontWeight="medium" color="black-40-solid">
              Inscription #
              {data?.inscriptionIndex ||
                ellipsisCenter({
                  str: tokenID,
                  limit: 3,
                })}
            </Text>
          </div>
        </Link>
      </td>
      <td>
        <div className={styles.owners}>
          <Link
            href={`${ROUTE_PATH.PROFILE}/${
              data?.owner?.walletAddressBtcTaproot || data?.owner?.walletAddress
            }`}
          >
            <Text fontWeight="medium">
              {formatAddressDisplayName(
                data?.owner?.displayName ||
                  data?.owner?.walletAddressBtcTaproot ||
                  data?.ownerAddr ||
                  '-',
                5
              )}
            </Text>
          </Link>
        </div>
      </td>
      <td>{renderBuyButton()}</td>
    </tr>
  );
};

export default ListViewItem;
