import React, { useContext } from 'react';
import { AssetsContext } from '@contexts/assets-context';
import Text from '@components/Text';
import { formatUnixDateTime } from '@utils/time';
import { Stack } from 'react-bootstrap';
import { ellipsisCenter, formatEthPrice } from '@utils/format';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import s from '@containers/Profile/Collected/Modal/History/styles.module.scss';
import Table from '@components/Table';
import { ITxHistoryBuyInsETH } from '@interfaces/api/bitcoin';
import { onClickCopy } from '@utils/copy';

const TxsETHTab = () => {
  const { txsETH } = useContext(AssetsContext);
  const TABLE_HISTORY_HEADING = ['Date', 'Status', 'Inscription', 'Amount'];

  const renderLink = (txHash: string, explore: string) => {
    if (!txHash) return null;
    return (
      <Stack direction="horizontal" gap={3}>
        <Text size="16" fontWeight="medium" color="black-100">
          {ellipsisCenter({ str: txHash, limit: 6 })}
        </Text>
        <SvgInset
          size={18}
          svgUrl={`${CDN_URL}/icons/ic-copy.svg`}
          className={s.wrapHistory_copy}
          onClick={() => onClickCopy(txHash)}
        />
        <SvgInset
          size={16}
          svgUrl={`${CDN_URL}/icons/ic-share.svg`}
          className={s.wrapHistory_copy}
          onClick={() => window.open(`${explore}/${txHash}`)}
        />
      </Stack>
    );
  };

  const renderItemInsID = (
    inscriptionID: string,
    number: string | number | undefined
  ) => {
    return (
      <div key={inscriptionID}>
        <Stack direction="horizontal" gap={3}>
          <Text size="16" fontWeight="medium" color="black-100">
            {`${ellipsisCenter({
              str: inscriptionID,
              limit: 6,
            })}`}
          </Text>
          <SvgInset
            size={18}
            svgUrl={`${CDN_URL}/icons/ic-copy.svg`}
            className={s.wrapHistory_copy}
            onClick={() => onClickCopy(inscriptionID)}
          />
          <SvgInset
            size={16}
            svgUrl={`${CDN_URL}/icons/ic-share.svg`}
            className={s.wrapHistory_copy}
            onClick={() =>
              window.open(`https://ordinals.com/inscription/${inscriptionID}`)
            }
          />
        </Stack>
        {!!number && (
          <Text size="16" fontWeight="medium" color="black-100">
            {`#${number}`}
          </Text>
        )}
      </div>
    );
  };

  const renderInsRow = (item: ITxHistoryBuyInsETH) => {
    if (item.inscription_id) {
      return renderItemInsID(item.inscription_id, undefined);
    }
    if (!!item.inscription_list && !!item.inscription_list.length) {
      return (
        <>
          {item.inscription_list.map(inscriptionID =>
            renderItemInsID(inscriptionID, undefined)
          )}
        </>
      );
    }
    return (
      <Text size="16" fontWeight="medium" color="black-100">
        ---
      </Text>
    );
  };

  const tableData = (txsETH || []).map(item => {
    return {
      id: `${item.id}-history`,
      render: {
        date: (
          <>
            <Text size="16" fontWeight="medium" color="black-100">
              {item.created_at
                ? formatUnixDateTime({ dateTime: Number(item.created_at) })
                : '---'}
            </Text>
            {!!item.order_id && (
              <Stack direction="horizontal" gap={2} style={{ marginTop: 3 }}>
                <Text size="16" fontWeight="medium" color="black-100">
                  ID #{ellipsisCenter({ str: item.order_id, limit: 3 })}
                </Text>
                <SvgInset
                  size={18}
                  svgUrl={`${CDN_URL}/icons/ic-copy.svg`}
                  className={s.wrapHistory_copy}
                  onClick={() => onClickCopy(item.order_id)}
                />
              </Stack>
            )}
          </>
        ),
        hash: (
          <>
            <div style={{ width: 'fit-content' }}>
              {renderLink(item.buy_tx, 'https://mempool.space/tx')}
              {renderLink(item.refund_tx, 'https://etherscan.io/tx')}
              <Text
                size="16"
                fontWeight="medium"
                style={{ color: item.statusColor }}
              >
                {item.status}
              </Text>
            </div>
          </>
        ),
        number: <>{renderInsRow(item)}</>,
        amount: (
          <>
            <Text size="16" fontWeight="medium" color="black-100">
              {item.amount_eth
                ? `${formatEthPrice(item.amount_eth)} ETH`
                : '---'}
            </Text>
          </>
        ),
      },
    };
  });

  return (
    <Table
      tableHead={TABLE_HISTORY_HEADING}
      data={tableData}
      className={s.historyTable}
    />
  );
};

export default TxsETHTab;
