import React, { useContext } from 'react';
import ButtonIcon, { ButtonSizesType } from '@components/ButtonIcon';
import cs from 'classnames';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@redux/user/selector';
import { WalletContext } from '@contexts/wallet-context';
import s from './styles.module.scss';
import { formatEthPrice } from '@utils/format';
import ModalBuyListed from '@components/Transactor/ButtonBuyListedFromETH/Modal';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';

interface IProps {
  className?: string;
  sizes?: ButtonSizesType;
  inscriptionID: string;
  price: number | string;
  inscriptionNumber: number;
  orderID: string;
  isDetail?: boolean;
  isShopLayout?: boolean;
}

const ButtonBuyListedFromETH = React.memo(
  ({
    className,
    orderID,
    inscriptionID,
    inscriptionNumber,
    price,
    sizes = 'xsmall',
    isDetail = false,
    isShopLayout = false,
  }: IProps) => {
    const [isShow, setShow] = React.useState(false);
    const user = useSelector(getUserSelector);
    const walletCtx = useContext(WalletContext);
    const { isProMode } = useContext(GenerativeProjectDetailContext);

    const openModal = async (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (!user || !user.walletAddressBtcTaproot) {
        await walletCtx.connect();
      }
      setShow(true);
    };

    const hideModal = () => {
      setShow(false);
    };
    if (!price) return null;

    return (
      <div
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
        }}
        className={cs(s.container, `${className}`)}
      >
        <ButtonIcon
          sizes={sizes}
          variants={`${isProMode ? 'outline-darkmode' : 'outline'}`}
          className={cs(s.container, `${className}`)}
          onClick={openModal}
        >
          {isShopLayout ? (
            <p className={s.text}>{`${formatEthPrice(price)} ETH`}</p>
          ) : (
            `${formatEthPrice(price)} ETH`
          )}
        </ButtonIcon>
        {!!user?.walletAddressBtcTaproot && isShow && (
          <ModalBuyListed
            isDetail={!!isDetail}
            inscriptionNumber={inscriptionNumber}
            orderID={orderID}
            inscriptionID={inscriptionID}
            title={`Payment ${
              inscriptionNumber ? `#${inscriptionNumber}` : ''
            }`}
            isShow={isShow}
            price={price}
            onHide={hideModal}
          />
        )}
      </div>
    );
  }
);

ButtonBuyListedFromETH.displayName = 'ButtonBuyListedFromETH';

export default ButtonBuyListedFromETH;
