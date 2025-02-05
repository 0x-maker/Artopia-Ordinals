import ButtonIcon from '@components/ButtonIcon';
import Link from '@components/Link';
import ModalConfirm from '@components/ModalConfirm';
import NFTDisplayBox from '@components/NFTDisplayBox';
import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import ButtonCancelListed from '@components/Transactor/ButtonCancelListed';
import ButtonListForSale from '@components/Transactor/ButtonListForSale';
import { CDN_URL } from '@constants/config';
import { ROUTE_PATH } from '@constants/route-path';
import { BTC_PROJECT } from '@constants/tracking-event-name';
import SendInscriptionModal from '@containers/Profile/Collected/Modal/SendInscription';
import { getStorageIns } from '@containers/Profile/Collected/Modal/SendInscription/utils';
import { ProfileContext } from '@contexts/profile-context';
import { HistoryStatusType, TrackTxType } from '@interfaces/api/bitcoin';
import { CollectedNFTStatus, ICollectedNFTItem } from '@interfaces/api/profile';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { sendAAEvent } from '@services/aa-tracking';
import { convertIpfsToHttp } from '@utils/image';
import cs from 'classnames';
import React, { useContext } from 'react';
import { TwitterShareButton } from 'react-share';
import MintStatusModal from '../Modal/MintStatus';
import s from './CollectedCard.module.scss';
import { AssetsContext } from '@contexts/assets-context';
import ButtonBuyListedFromBTC from '@components/Transactor/ButtonBuyListedFromBTC';
import ButtonBuyListedFromETH from '@components/Transactor/ButtonBuyListedFromETH';
import { isImageURL } from '@utils/url';
import { LOGO_MARKETPLACE_URL } from '@constants/common';
import { ellipsisCenter, formatAddress } from '@utils/format';

interface IPros {
  project: ICollectedNFTItem;
  className?: string;
  index?: number;
}

const CollectedCard = ({ project, className }: IPros): JSX.Element => {
  const user = useAppSelector(getUserSelector);
  const [showSendModal, setShowSendModal] = React.useState(false);
  const [showMintStatusModal, setShowMintStatusModal] = React.useState(false);
  const [showConfirmCancelModal, setShowConfirmCancelModal] =
    React.useState(false);

  const { handelcancelMintingNFT, currentUser } = useContext(ProfileContext);

  const { isLoadingHistory, history } = useContext(AssetsContext);

  const toggleModal = () => {
    setShowSendModal(value => !value);
  };

  const toggleMintStatusModal = () => {
    setShowMintStatusModal(value => !value);
  };

  const toggleConfirmCancelModal = () => {
    setShowConfirmCancelModal(value => !value);
  };

  const isOwner = currentUser?.id === user?.id;

  const linkPath =
    project.status === CollectedNFTStatus.Success
      ? project.projectID
        ? `${ROUTE_PATH.GENERATIVE}/${project.projectID}/${project.inscriptionID}`
        : `${ROUTE_PATH.LIVE}/${project.inscriptionID}`
      : `${ROUTE_PATH.GENERATIVE}/${project.projectID}`;

  const isListable =
    project?.status !== CollectedNFTStatus.Minting &&
    !project.orderID &&
    !project.buyable &&
    !project.cancelling &&
    isOwner;

  const isCancelListed = React.useMemo(() => {
    const isCancel =
      !!project.orderID && project.buyable && !project.cancelling && isOwner;
    if (isCancel) return true;
  }, [project.orderID, project.buyable, project.cancelling, isOwner]);

  const statusWithHistory = React.useMemo(() => {
    const findHistory = (history || []).find(
      tx =>
        !!project.inscriptionID &&
        !!tx.inscription_id &&
        tx.inscription_id === project.inscriptionID
    );
    if (!findHistory) {
      return {
        isPending: false,
        status: '',
      };
    }
    let isPending = findHistory.status === HistoryStatusType.pending;
    let status = 'Pending...';
    switch (findHistory.type) {
      case TrackTxType.cancel:
        status = 'Cancelling...';
        break;
      case TrackTxType.buyInscription:
        status = 'Buying...';
        break;
      case TrackTxType.buySplit:
      case TrackTxType.listSplit:
        status = '';
        isPending = false;
        break;
    }
    return {
      isPending,
      status,
    };
  }, [history, project.inscriptionID]);

  const showSendButton = React.useMemo(() => {
    if (!isOwner) return false;
    if (!project?.inscriptionID || !!getStorageIns(project?.inscriptionID))
      return false;
    return (
      !statusWithHistory.isPending &&
      !isLoadingHistory &&
      project?.status === CollectedNFTStatus.Success &&
      !isCancelListed &&
      !project.cancelling
    );
  }, [
    statusWithHistory,
    isLoadingHistory,
    project?.status,
    isOwner,
    project?.inscriptionID,
    project.cancelling,
    isCancelListed,
  ]);

  const tokenIdName =
    project.status === CollectedNFTStatus.Success
      ? `${
          project.tokenNumber
            ? `${project.projectName}`
            : `Inscription #${project.inscriptionNumber}`
        }`
      : project.projectName || '';

  const imageUrl =
    project.image && isImageURL(project.image)
      ? project.image
      : project.inscriptionID === undefined
      ? LOGO_MARKETPLACE_URL
      : undefined;

  const formatInscriptionID = React.useMemo(() => {
    return project.inscriptionID
      ? ellipsisCenter({ str: project.inscriptionID, limit: 5 })
      : '';
  }, [project.inscriptionID]);

  const subTitle1 = React.useMemo(() => {
    if (project.status !== CollectedNFTStatus.Success) return '';
    return project.projectName
      ? `Inscription #${project.inscriptionNumber}`
      : `Inscription ID: ${formatInscriptionID}`;
  }, [project.status, project.projectName, formatInscriptionID]);

  const subTitle2 = React.useMemo(() => {
    const artistName =
      project.artistName === 'Unverified User'
        ? project.projectName || ''
        : project.artistName || '';
    if (artistName) return artistName;
    if (currentUser?.walletAddressBtcTaproot) {
      return `${formatAddress(currentUser?.walletAddressBtcTaproot)}`;
    }
    return '';
  }, [
    project.artistName,
    project.projectName,
    currentUser?.walletAddressBtcTaproot,
  ]);

  const isNotShowBlur =
    project.status === CollectedNFTStatus.Success ||
    project.statusText === 'Transferring';

  const renderStatusText = () => {
    if (statusWithHistory.isPending) {
      return (
        <Text
          className={s.projectCard_creator_status}
          size={'16'}
          fontWeight="medium"
          color="black-40-solid"
        >
          {statusWithHistory.status}
        </Text>
      );
    }
    return (
      <>
        {project.status !== CollectedNFTStatus.Success && (
          <Link href="" onClick={toggleMintStatusModal}>
            <Text
              className={s.projectCard_creator_status_underline}
              size={'16'}
              fontWeight="medium"
              color="black-40-solid"
            >
              {`${project.statusText}...`}
            </Text>
          </Link>
        )}
      </>
    );
  };

  const renderButton = () => {
    if (
      !isOwner &&
      project.buyable &&
      project.priceBTC &&
      project.buyable &&
      project.priceBTC &&
      project.inscriptionID &&
      project.inscriptionNumber &&
      !project.cancelling
    ) {
      return (
        <div className={s.row}>
          <Link
            href=""
            onClick={() => ''}
            className={s.projectCard_status_buyBtn}
          >
            <ButtonBuyListedFromBTC
              inscriptionID={project.inscriptionID}
              price={project.priceBTC}
              inscriptionNumber={Number(project.inscriptionNumber)}
              orderID={project.orderID}
            />
          </Link>
          <Link
            href=""
            onClick={() => ''}
            className={s.projectCard_status_buyBtn}
          >
            <ButtonBuyListedFromETH
              inscriptionID={project.inscriptionID}
              price={project.priceETH}
              inscriptionNumber={Number(project.inscriptionNumber)}
              orderID={project.orderID}
            />
          </Link>
        </div>
      );
    }
    return (
      <div className={s.row}>
        {showSendButton && (
          <Link href="" onClick={toggleModal}>
            <ButtonIcon
              variants="outline"
              className={s.projectCard_status_sendBtn}
            >
              Send
            </ButtonIcon>
          </Link>
        )}
        {isListable && (
          <Link
            href=""
            onClick={() => {
              // TODO
            }}
          >
            <ButtonListForSale
              inscriptionID={project.inscriptionID || ''}
              inscriptionNumber={Number(project.inscriptionNumber)}
            />
          </Link>
        )}
        {isCancelListed && (
          <Link
            href=""
            className={s.projectCard_status_cancelBtnList}
            onClick={() => {
              // TODO
            }}
          >
            <ButtonCancelListed
              inscriptionID={project.inscriptionID || ''}
              inscriptionNumber={Number(project.inscriptionNumber)}
              orderID={project.orderID}
            />
          </Link>
        )}

        {project.isCancel && !isCancelListed && (
          <Link
            href=""
            className={s.projectCard_status_cancelBtn}
            onClick={toggleConfirmCancelModal}
          >
            <Text as="span" size="14" fontWeight="medium">
              Cancel
            </Text>
          </Link>
        )}
      </div>
    );
  };

  return (
    <>
      <Link href={linkPath} className={`${s.projectCard} ${className}`}>
        <div className={s.projectCard_inner}>
          {imageUrl ? (
            <div className={`${s.projectCard_thumb}`}>
              <div className={s.projectCard_thumb_inner}>
                <img
                  src={convertIpfsToHttp(imageUrl)}
                  alt={imageUrl}
                  loading={'lazy'}
                />
              </div>
              {!isNotShowBlur && (
                <div className={s.projectCard_thumb_backdrop} />
              )}
            </div>
          ) : (
            <div className={`${s.projectCard_thumb}`}>
              <div className={s.projectCard_thumb_inner}>
                <NFTDisplayBox
                  inscriptionID={project.inscriptionID}
                  type={project.contentType}
                  variants="absolute"
                />
                <Link
                  href={linkPath}
                  className={s.projectCard_thumb_inner_mask}
                />
              </div>
              {!isNotShowBlur && (
                <div className={s.projectCard_thumb_backdrop} />
              )}
            </div>
          )}
          <div className={s.projectCard_statusContainer}>
            <div className={s.projectCard_status}>
              <div className={cs(s.projectCard_info, s.desktop)}>
                {renderStatusText()}
                {tokenIdName && (
                  <div className={s.projectCard_creator}>
                    <Text
                      className={s.projectCard_creator_text}
                      size={'20'}
                      fontWeight="medium"
                    >
                      {tokenIdName}
                    </Text>
                    <Text size={'20'} fontWeight="medium">
                      {project.tokenNumber && project.projectName
                        ? `#${project.tokenNumber}`
                        : ''}
                    </Text>
                  </div>
                )}
                {subTitle1 && (
                  <Text size="20" fontWeight="medium" color="black-40-solid">
                    {subTitle1}
                  </Text>
                )}
              </div>
              {project.status === CollectedNFTStatus.Success && (
                <TwitterShareButton
                  className={s.twitter}
                  url={
                    isOwner
                      ? `${location.origin}${linkPath}?referral_code=${user?.id}`
                      : `${location.origin}${linkPath}`
                  }
                  title={''}
                  hashtags={[]}
                >
                  <ButtonIcon
                    sizes="small"
                    variants="ghost"
                    className={s.twitter_btnShare}
                    onClick={() => {
                      sendAAEvent({
                        eventName: BTC_PROJECT.SHARE_REFERRAL_LINK,
                        data: {
                          nft_id: project?.id,
                          project_id: project?.projectID,
                          nft_name: project?.name,
                          nft_image: project?.image,
                          referrer_id: user?.id,
                          referrer_name: user?.displayName,
                          referrer_address: user?.walletAddress,
                          referrer_taproot_address:
                            user?.walletAddressBtcTaproot,
                        },
                      });
                    }}
                    startIcon={
                      <SvgInset
                        size={16}
                        svgUrl={`${CDN_URL}/icons/ic-twitter-white-20x20.svg`}
                      />
                    }
                  >
                    Share
                  </ButtonIcon>
                </TwitterShareButton>
              )}
            </div>
            <div className={s.projectCard_buttonContainer}>
              <div>
                {project.status !== CollectedNFTStatus.Success ? (
                  project.quantity && (
                    <Text
                      size={'16'}
                      fontWeight="medium"
                      style={{ lineBreak: 'auto' }}
                    >
                      {project.quantity > 1
                        ? `Quantity: ${project.quantity}`
                        : `${subTitle2}`}
                    </Text>
                  )
                ) : (
                  <Text size={'16'} fontWeight="medium">
                    {`${subTitle2}`}
                  </Text>
                )}
              </div>
              {renderButton()}
            </div>
          </div>
        </div>
      </Link>
      {project.id && showMintStatusModal && (
        <MintStatusModal
          showModal={showMintStatusModal}
          onClose={toggleMintStatusModal}
          mintID={project.id}
          projectName={project.projectName || 'Mint NFT'}
        />
      )}
      {!!project.inscriptionID && showSendModal && showSendButton && (
        <SendInscriptionModal
          showModal={showSendModal}
          inscriptionID={project.inscriptionID}
          onClose={toggleModal}
          inscriptionNumber={Number(project.inscriptionNumber || 0)}
        />
      )}
      {project.isCancel && !isCancelListed && showConfirmCancelModal && (
        <ModalConfirm
          title="Are you sure you want to cancel this
          transaction?"
          showModal={showConfirmCancelModal}
          onClose={toggleConfirmCancelModal}
          onConfirm={() => {
            handelcancelMintingNFT(project.id);
            toggleConfirmCancelModal();
          }}
        />
      )}
    </>
  );
};

export default React.memo(CollectedCard);
