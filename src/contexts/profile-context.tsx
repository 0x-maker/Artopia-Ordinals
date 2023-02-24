import { SimpleLoading } from '@components/SimpleLoading';
import { NETWORK_CHAIN_ID } from '@constants/config';
import { ROUTE_PATH } from '@constants/route-path';
import { ErrorMessage } from '@enums/error-message';
import { LogLevel } from '@enums/log-level';
import useBTCSignOrd from '@hooks/useBTCSignOrd';
import useContractOperation from '@hooks/useContractOperation';
import {
  IListingTokensResponse,
  ITokenOfferListResponse,
} from '@interfaces/api/marketplace';
import { ICollectedNFTItem } from '@interfaces/api/profile';
import { IGetProjectItemsResponse } from '@interfaces/api/project';
import { IGetReferralsResponse } from '@interfaces/api/referrals';
import { IGetProfileTokensResponse } from '@interfaces/api/token-uri';
import { TokenOffer } from '@interfaces/token';
import { User } from '@interfaces/user';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import AcceptTokenOffer from '@services/contract-operations/generative-marketplace/accept-token-offer';
import CancelTokenOfferOperation from '@services/contract-operations/generative-marketplace/cancel-token-offer';
import {
  getListingTokensByWallet,
  getMakeOffersByWallet,
} from '@services/marketplace';
import {
  cancelMintingCollectedNFT,
  getCollectedNFTs,
  getMintingCollectedNFTs,
  getProfileByWallet,
  getProfileProjectsByWallet,
  getProfileTokens,
} from '@services/profile';
import { getReferrals } from '@services/referrals';
import log from '@utils/logger';
import { debounce, isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import toast from 'react-hot-toast';
import useAsyncEffect from 'use-async-effect';

const LOG_PREFIX = 'ProfileContext';

export interface IProfileContext {
  currentUser: User | null;
  userWalletAddress?: string;
  profileTokens?: IGetProfileTokensResponse;
  profileProjects?: IGetProjectItemsResponse;
  profileMakeOffer?: ITokenOfferListResponse;
  profileListing?: IListingTokensResponse;
  collectedNFTs: ICollectedNFTItem[];
  referralListing?: IGetReferralsResponse;

  isLoaded: boolean;

  isLoadedProfileTokens: boolean;
  isLoadedProfileProjects: boolean;
  isLoadedProfileMakeOffer: boolean;
  isLoadedProfileListing: boolean;
  isLoadedProfileCollected: boolean;
  isLoadingProfileCollected: boolean;
  isLoadedProfileReferral: boolean;

  handleFetchTokens: () => void;
  handleFetchProjects: () => void;
  handleFetchMakeOffers: (r?: boolean) => void;
  handleFetchListingTokens: () => void;
  handleFetchListingReferrals: () => void;
  handleCancelOffer: (offer: TokenOffer) => void;
  handleAcceptOfferReceived: (offer: TokenOffer) => void;
  handelcancelMintingNFT: (mintID?: string) => void;
  debounceFetchDataCollectedNFTs: () => void;

  isOfferReceived: boolean;
  setIsOfferReceived: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialValue: IProfileContext = {
  currentUser: null,
  isLoaded: false,
  isLoadedProfileTokens: false,
  isLoadedProfileProjects: false,
  isLoadedProfileMakeOffer: false,
  isLoadedProfileListing: false,
  isLoadedProfileCollected: false,
  isLoadedProfileReferral: false,
  isLoadingProfileCollected: false,
  collectedNFTs: [],
  referralListing: undefined,

  handleFetchTokens: () => new Promise<void>(r => r()),
  handleFetchProjects: () => new Promise<void>(r => r()),
  handleFetchMakeOffers: () => new Promise<void>(r => r()),
  handleFetchListingTokens: () => new Promise<void>(r => r()),
  handleCancelOffer: () => new Promise<void>(r => r()),
  handleAcceptOfferReceived: () => new Promise<void>(r => r()),
  handelcancelMintingNFT: () => new Promise<void>(r => r()),
  debounceFetchDataCollectedNFTs: () => new Promise<void>(r => r()),
  handleFetchListingReferrals: () => new Promise<void>(r => r()),

  isOfferReceived: false,
  setIsOfferReceived: _ => {
    return;
  },
};

export const ProfileContext =
  React.createContext<IProfileContext>(initialValue);

export const ProfileProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const user = useAppSelector(getUserSelector);
  const router = useRouter();
  const [userWalletAddress, setUserWalletAddress] = useState<
    string | undefined
  >();
  const { walletAddress } = router.query as { walletAddress: string };

  const isOwner = !walletAddress || user?.walletAddress === walletAddress;

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { call: cancelOffer } = useContractOperation(
    CancelTokenOfferOperation,
    true
  );

  const { call: acceptOfferReceived } = useContractOperation(
    AcceptTokenOffer,
    true
  );

  const [profileTokens, setProfileTokens] = useState<
    IGetProfileTokensResponse | undefined
  >();

  const [isLoadedProfileTokens, setIsLoadedProfileTokens] =
    useState<boolean>(false);

  const [profileProjects, setProfileProjects] = useState<
    IGetProjectItemsResponse | undefined
  >();

  const [isLoadedProfileProjects, setIsLoadedProfileProjects] =
    useState<boolean>(false);

  const [isLoadedProfileReferral, setIsLoadedProfileReferral] =
    useState<boolean>(false);

  const [profileMakeOffer, setProfileMakeOffer] = useState<
    ITokenOfferListResponse | undefined
  >();

  const [isLoadedProfileMakeOffer, setIsLoadedProfileMakeOffer] =
    useState<boolean>(false);
  const [profileListing, setProfileListing] = useState<
    IListingTokensResponse | undefined
  >();

  const [referralListing, setReferralListing] = useState<
    IGetReferralsResponse | undefined
  >();

  const [isLoadedProfileListing, setIsLoadedProfileListing] =
    useState<boolean>(false);

  const [isOfferReceived, setIsOfferReceived] = useState<boolean>(false);

  const handleFetchProjects = useCallback(async () => {
    try {
      if (currentUser?.walletAddress) {
        let page = (profileProjects && profileProjects?.page) || 0;
        page += 1;

        setIsLoadedProfileProjects(false);
        const projects = await getProfileProjectsByWallet({
          walletAddress: currentUser.walletAddress,
          page,
          limit: 12,
        });

        if (projects) {
          if (profileProjects && profileProjects?.result) {
            projects.result = [...profileProjects.result, ...projects.result];
          }

          setProfileProjects(projects);
          setIsLoadedProfileProjects(true);
        }
      }
    } catch (ex) {
      log('can not fetch created collections', LogLevel.ERROR, LOG_PREFIX);
      setIsLoadedProfileProjects(true);
    }
  }, [currentUser, profileProjects]);

  const handleFetchListingTokens = useCallback(async () => {
    try {
      if (currentUser?.walletAddress) {
        const listingTokens = await getListingTokensByWallet({
          walletAddress: currentUser.walletAddress,
          closed: false,
        });
        if (listingTokens && listingTokens) {
          setProfileListing(listingTokens);
        }
        setIsLoadedProfileListing(true);
      }
    } catch (ex) {
      log('can not fetch listing tokens', LogLevel.ERROR, LOG_PREFIX);
    }
  }, [currentUser]);

  const handleFetchMakeOffers = useCallback(async () => {
    try {
      if (currentUser?.walletAddress) {
        setIsLoadedProfileMakeOffer(false);
        const makeOffers = await getMakeOffersByWallet({
          walletAddress: currentUser.walletAddress,
          closed: false,
          isNftOwner: isOfferReceived,
        });
        if (makeOffers) {
          if (isOfferReceived) {
            const filteredData = makeOffers.result.filter(
              (data: TokenOffer) => {
                return (
                  data &&
                  data.buyerInfo &&
                  data.buyerInfo.walletAddress !== currentUser.walletAddress
                );
              }
            );

            makeOffers.result = filteredData;
          }

          setProfileMakeOffer(makeOffers);
          setIsLoadedProfileMakeOffer(true);
        }
      }
    } catch (ex) {
      log('can not fetch listing tokens', LogLevel.ERROR, LOG_PREFIX);
      setIsLoadedProfileMakeOffer(true);
    }
  }, [currentUser, isOfferReceived]);

  const handleFetchTokens = useCallback(async () => {
    try {
      if (currentUser?.walletAddress) {
        let page = (profileTokens && profileTokens?.page) || 0;
        page += 1;

        setIsLoadedProfileTokens(false);
        const tokens = await getProfileTokens({
          walletAddress: currentUser.walletAddress,
          limit: 12,
          page,
        });
        if (tokens) {
          if (profileTokens && profileTokens?.result) {
            tokens.result = [...profileTokens.result, ...tokens.result];
          }

          setProfileTokens(tokens);
          setIsLoadedProfileTokens(true);
        }
      }
    } catch (ex) {
      log('can not fetch tokens', LogLevel.ERROR, LOG_PREFIX);
      setIsLoadedProfileTokens(true);
    }
  }, [currentUser, profileTokens]);

  const handleFetchProfileByWallet = useCallback(async () => {
    try {
      if (walletAddress) {
        const getUser = await getProfileByWallet({
          walletAddress: walletAddress.toLowerCase(),
        });
        if (getUser && getUser.id) {
          setCurrentUser(getUser);
        } else {
          router.push(ROUTE_PATH.DROPS);
        }
      }
    } catch (ex) {
      log('can not fetch tokens', LogLevel.ERROR, LOG_PREFIX);
    }
  }, [walletAddress]);

  const handleCancelOffer = async (offer: TokenOffer): Promise<void> => {
    const tx = await cancelOffer({
      offerId: offer.offeringID,
      chainID: NETWORK_CHAIN_ID,
    });

    if (!tx) {
      log('Cancel token offer transaction error.', LogLevel.ERROR, LOG_PREFIX);
      throw Error(ErrorMessage.DEFAULT);
    }

    // Refresh offers data
    handleFetchMakeOffers();
  };

  const handleAcceptOfferReceived = async (
    offer: TokenOffer
  ): Promise<void> => {
    const tx = await acceptOfferReceived({
      offerId: offer.offeringID,
      chainID: NETWORK_CHAIN_ID,
    });

    if (!tx) {
      log('Cancel token offer transaction error.', LogLevel.ERROR, LOG_PREFIX);
      throw Error(ErrorMessage.DEFAULT);
    }

    // Refresh offers data
    handleFetchMakeOffers();
  };

  const handleFetchListingReferrals = async () => {
    try {
      if (currentUser?.walletAddress) {
        const referralListing = await getReferrals({
          referrerID: currentUser.id,
        });
        setReferralListing(referralListing);
      }
    } catch (err: unknown) {
      log('failed to fetch refferal listing', LogLevel.ERROR, LOG_PREFIX);
      throw Error();
    } finally {
      setIsLoadedProfileReferral(true);
    }
  };

  useAsyncEffect(async () => {
    setIsLoaded(false);
    if (!router.isReady) return;
    if (walletAddress) {
      setUserWalletAddress(walletAddress);
      await handleFetchProfileByWallet();
      setTimeout(() => {
        setIsLoaded(true);
      }, 400);
    } else {
      setCurrentUser(user);
      setTimeout(() => {
        setIsLoaded(true);
      }, 400);
    }
  }, [walletAddress, router, user]);

  useAsyncEffect(async () => {
    if (!router.isReady || !currentUser) return;

    await handleFetchTokens();
    await handleFetchMakeOffers();
    await handleFetchProjects();
    await handleFetchListingTokens();
    await handleFetchListingReferrals();
  }, [currentUser]);

  useEffect(() => {
    handleFetchMakeOffers();
  }, [isOfferReceived]);

  // Collected
  const [isLoadedProfileCollected, setIsLoadedProfileCollected] =
    useState<boolean>(false);
  const [isLoadingProfileCollected, setIsLoadingProfileCollected] =
    useState<boolean>(false);

  const { ordAddress } = useBTCSignOrd();

  const [collectedNFTs, setCollectedNFTs] = useState<ICollectedNFTItem[]>([]);
  const currentBtcAddressRef = useRef(ordAddress);

  const handelcancelMintingNFT = async (mintID?: string) => {
    if (mintID) {
      try {
        const success = await cancelMintingCollectedNFT(mintID);
        if (success) {
          setCollectedNFTs(collectedNFTs.filter(nft => nft.id !== mintID));
        }
      } catch (error) {
        toast.error(ErrorMessage.DEFAULT);
      }
    }
  };

  const fetchDataCollectedNFTs = async () => {
    try {
      const [mintingNFTs, mintedNFTs] = await Promise.all([
        isOwner
          ? await getMintingCollectedNFTs(currentBtcAddressRef.current)
          : [],
        await getCollectedNFTs(currentBtcAddressRef.current),
      ]);
      const filterNTFs = [
        ...mintingNFTs,
        ...mintedNFTs.filter(
          mintedNft =>
            !mintingNFTs.find(
              mintingNft => mintingNft.inscriptionID === mintedNft.inscriptionID
            )
        ),
      ];
      setCollectedNFTs(filterNTFs);
    } catch (error) {
      // handle fetch data error here
    } finally {
      setIsLoadingProfileCollected(false);
      setIsLoadedProfileCollected(true);
    }
  };
  const debounceFetchDataCollectedNFTs = debounce(fetchDataCollectedNFTs, 300);

  useEffect(() => {
    if (
      currentUser &&
      currentUser.walletAddressBtcTaproot &&
      !isEmpty(currentUser.walletAddressBtcTaproot) &&
      currentBtcAddressRef.current !== currentUser.walletAddressBtcTaproot
    ) {
      currentBtcAddressRef.current = currentUser.walletAddressBtcTaproot;
      debounceFetchDataCollectedNFTs();
    } else {
      setTimeout(() => {
        setIsLoadedProfileCollected(true);
      }, 30000);
    }
  }, [currentUser]);

  const contextValues = useMemo((): IProfileContext => {
    return {
      currentUser,
      userWalletAddress,
      profileTokens,
      profileProjects,
      profileMakeOffer,
      profileListing,
      collectedNFTs,
      referralListing,

      isLoaded,
      isLoadedProfileTokens,
      isLoadedProfileProjects,
      isLoadedProfileMakeOffer,
      isLoadedProfileListing,
      isOfferReceived,
      isLoadedProfileCollected,
      isLoadingProfileCollected,
      isLoadedProfileReferral,

      handleFetchTokens,
      handleFetchProjects,
      handleFetchMakeOffers,
      handleFetchListingTokens,
      handleCancelOffer,
      setIsOfferReceived,
      handleAcceptOfferReceived,
      handelcancelMintingNFT,
      handleFetchListingReferrals,
      debounceFetchDataCollectedNFTs,
    };
  }, [
    currentUser,
    userWalletAddress,
    profileTokens,
    profileProjects,
    profileMakeOffer,
    profileListing,
    referralListing,

    isLoaded,
    isLoadedProfileTokens,
    isLoadedProfileProjects,
    isLoadedProfileMakeOffer,
    isLoadedProfileListing,
    isOfferReceived,
    isLoadedProfileReferral,

    handleFetchTokens,
    handleFetchProjects,
    handleFetchMakeOffers,
    handleFetchListingTokens,
    handleCancelOffer,
    setIsOfferReceived,
    handleAcceptOfferReceived,
    handleFetchListingReferrals,
  ]);

  return (
    <ProfileContext.Provider value={contextValues}>
      <SimpleLoading isCssLoading={false} />
      {children}
    </ProfileContext.Provider>
  );
};
