import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import { IProjectMintFeeRate } from '@interfaces/api/project';
import { formatBTCPrice, formatEthPrice } from '@utils/format';
import cs from 'classnames';
import React, { useRef, useState } from 'react';
import { Col } from 'react-bootstrap';
import { IFeeRateType } from '../MintFeeRate/useMintFeeRate';
import s from './styles.module.scss';

interface IProps {
  selectedRateType: IFeeRateType | undefined;
  handleChangeRateType: (rate: IFeeRateType) => void;

  customRate: string;
  handleChangeCustomRate?: (rate: string) => void;

  feeRate: IProjectMintFeeRate;
  payType: 'btc' | 'eth';
  useCustomRate?: boolean;
}

const MintFeeRateCustom = ({
  handleChangeRateType,
  selectedRateType,
  feeRate,
  handleChangeCustomRate,
  customRate,
  payType = 'btc',
}: IProps) => {
  const { fastest } = feeRate;

  const inputRef = useRef<HTMLInputElement>(null);

  const [cusRate, setCurRate] = useState('');

  const max = 50;
  const min = 0;

  const onChangeCustomSats = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof handleChangeCustomRate === 'function') {
      setCurRate(e.target.value);

      const value = Math.max(min, Math.min(max, Number(e.target.value)));
      handleChangeCustomRate(`${value}`);
    }
  };
  return (
    <div className={s.container}>
      <div className={s.header}>
        <p className={s.feeTitle}>Customize Sats</p>
        <div className={s.feeContainer}>
          <p className={s.feeDetail}>{`${customRate || 0} sats/vByte`}</p>
          <div className={s.feeTotalContainer}>
            {!!customRate && feeRate.customRate && (
              <p className={s.feeTotal}>
                ~{' '}
                {`${
                  payType === 'btc'
                    ? formatBTCPrice(
                        feeRate.customRate.mintFees.btc.networkFee
                      ) + ' BTC'
                    : formatEthPrice(
                        feeRate.customRate.mintFees.eth.networkFee
                      ) + ' ETH'
                }`}
              </p>
            )}
          </div>
        </div>
      </div>

      <Col className={s.row}>
        <div
          className={cs(s.mintFeeItem, {
            [`${s.mintFeeItem__active}`]: selectedRateType === 'customRate',
          })}
          onClick={() => {
            if (
              !!handleChangeCustomRate &&
              typeof handleChangeCustomRate === 'function' &&
              !!inputRef &&
              !!inputRef.current
            ) {
              handleChangeRateType('customRate');
              inputRef.current.focus();
              if (!(customRate && Number(customRate) > 0)) {
                handleChangeCustomRate(`${fastest.rate + 1}`);
              }
            }
          }}
        >
          <input
            ref={inputRef}
            id="feeRate"
            type="number"
            name="feeRate"
            placeholder="0"
            value={customRate || cusRate}
            onChange={onChangeCustomSats}
            className={s.mintFeeItem_input}
          />
        </div>
        {selectedRateType === 'customRate' &&
          customRate &&
          Number(customRate) > 0 &&
          feeRate.customRate &&
          feeRate.customRate.rate < feeRate.economy.rate && (
            <div className={s.warning}>
              <SvgInset svgUrl={`${CDN_URL}/icons/bell-ringing-01.svg`} />
              <p className={s.warning_title}>
                This transaction is expected to take longer than usual to
                process. You might want to consider another option to reduce
                your waiting time.
              </p>
            </div>
          )}
      </Col>
    </div>
  );
};

export default MintFeeRateCustom;
