import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { WalletManager } from '@services/wallet';
import { generateNonceMessage, verifyNonceMessage } from '@services/auth';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';
import { useAppDispatch } from '@redux';
import { resetUser, setUser } from '@redux/user/action';
import { WalletError } from '@enums/wallet-error';
import { clearAuthStorage, setAccessToken } from '@utils/auth';
import { getProfile } from '@services/profile';
import { NETWORK_CHAIN_ID } from '@constants/config';
import Web3 from 'web3';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@redux/user/selector';
import { WalletEvent } from '@enums/wallet-event';
import { METAMASK_DOWNLOAD_PAGE } from '@constants/common';

const LOG_PREFIX = 'WalletContext';

interface IWalletState {
  chainID: number;
}

export interface IWalletContext {
  connectedAddress: () => Promise<string | null>;
  walletManager: WalletManager | null;
  checkAndSwitchChain: (params: IWalletState) => Promise<void>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  transfer: (addr: string, val: string) => Promise<string>;
  walletBalance: number;
  getWalletBalance: () => Promise<number>;
}

const initialValue: IWalletContext = {
  connectedAddress: () => new Promise(r => r(null)),
  walletManager: null,
  checkAndSwitchChain: async (_: IWalletState): Promise<void> =>
    new Promise(r => r()),
  connect: () => new Promise<void>(r => r()),
  disconnect: () => new Promise<void>(r => r()),
  transfer: (_address: string, _val: string) => new Promise<string>(r => r('')),
  walletBalance: 0,
  getWalletBalance: () => new Promise<number>(r => r(0)),
};

export const WalletContext = React.createContext<IWalletContext>(initialValue);

export const WalletProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const [walletManager, setWalletManager] = useState<WalletManager | null>(
    null
  );
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const walletManagerRef = useRef<WalletManager | null>(walletManager);
  const dispatch = useAppDispatch();
  const user = useSelector(getUserSelector);

  const connectedAddress = useCallback(async (): Promise<string | null> => {
    const wallet = walletManagerRef.current;
    if (!wallet) {
      throw Error(WalletError.NO_INSTANCE);
    }

    const walletAddress = await wallet.connectedAddress();
    return walletAddress;
  }, []);

  const checkAndSwitchChain = useCallback(
    async ({ chainID }: IWalletState): Promise<void> => {
      const wallet = walletManagerRef.current;

      if (!wallet) {
        throw Error(WalletError.NO_INSTANCE);
      }

      const isChainSupported = await wallet.isChainSupported(chainID);
      if (!isChainSupported) {
        const walletRes = await wallet.requestSwitchChain(chainID);
        if (walletRes.isError) {
          throw Error(walletRes.message);
        }
      }
    },
    []
  );

  const connect = useCallback(async (): Promise<void> => {
    const wallet = walletManagerRef.current;

    if (!wallet) {
      throw Error(WalletError.NO_INSTANCE);
    }

    if (!wallet.isInstalled()) {
      window.open(METAMASK_DOWNLOAD_PAGE);
      throw Error(WalletError.NO_METAMASK);
    }

    const walletRes = await wallet.connect();
    if (!walletRes.isSuccess || !walletRes.data) {
      throw Error(walletRes.message);
    }

    await checkAndSwitchChain({ chainID: NETWORK_CHAIN_ID });

    const walletAddress = walletRes.data;
    try {
      const { message } = await generateNonceMessage({
        address: walletAddress,
      });
      const { data: signature } = await wallet.signMessage(
        message,
        walletAddress
      );
      if (!signature) {
        throw Error(WalletError.FAILED_LINK_WALLET);
      }
      const { accessToken, refreshToken } = await verifyNonceMessage({
        signature,
        address: walletAddress,
      });
      setAccessToken(accessToken, refreshToken);
      const userRes = await getProfile();
      dispatch(setUser(userRes));
    } catch (err: unknown) {
      log('failed to connect wallet', LogLevel.Error, LOG_PREFIX);
      throw Error(WalletError.FAILED_LINK_WALLET);
    }
  }, [dispatch]);

  const disconnect = useCallback(async (): Promise<void> => {
    try {
      clearAuthStorage();
      dispatch(resetUser());
    } catch (err: unknown) {
      log('failed to disconnect wallet', LogLevel.Error, LOG_PREFIX);
      throw Error(WalletError.FAILED_UNLINK_WALLET);
    }
  }, [dispatch]);

  const transfer = useCallback(
    async (toAddress: string, value: string): Promise<string> => {
      const wallet = walletManagerRef.current;
      if (!wallet) {
        throw Error(WalletError.NO_INSTANCE);
      }

      const walletRes = await wallet.connect();
      if (!walletRes.isSuccess || !walletRes.data) {
        throw Error(walletRes.message);
      }

      try {
        await checkAndSwitchChain({
          chainID: NETWORK_CHAIN_ID,
        });
      } catch (err: unknown) {
        log('failed to switch chain', LogLevel.Error, LOG_PREFIX);
        throw Error(WalletError.FAILED_SWITCH_CHAIN);
      }

      const walletAddress = walletRes.data;
      try {
        const transferRes = await wallet.transfer({
          fromAddress: walletAddress,
          toAddress,
          value,
        });
        if (!transferRes.data || !transferRes.isSuccess) {
          throw Error(transferRes.message);
        }
        return transferRes.data;
      } catch (err: unknown) {
        log('failed to transfer', LogLevel.Error, LOG_PREFIX);
        throw Error(WalletError.FAILED_TRANSFER);
      }
    },
    []
  );

  const getWalletBalance = async (): Promise<number> => {
    const wallet = walletManagerRef.current;

    if (!wallet) {
      throw Error(WalletError.NO_INSTANCE);
    }

    if (!wallet.isInstalled()) {
      window.open(METAMASK_DOWNLOAD_PAGE);
      throw Error(WalletError.NO_METAMASK);
    }

    const walletAddress = await connectedAddress();

    if (walletAddress) {
      const balanceRes = await wallet.getBalance(walletAddress);
      if (balanceRes.data) {
        const balanceStr = Web3.utils.fromWei(
          balanceRes.data.toString(),
          'ether'
        );
        setWalletBalance(parseFloat(balanceStr));
        return parseFloat(balanceStr);
      }
    }
    return 0;
  };

  const handleWalletEvents = async (): Promise<void> => {
    await disconnect();
    location.reload();
  };

  useEffect(() => {
    const walletManagerInstance = new WalletManager();
    walletManagerRef.current = walletManagerInstance;
    setWalletManager(walletManagerInstance);
  }, []);

  useEffect(() => {
    if (walletManager) {
      walletManagerRef.current = walletManager;
      walletManagerRef.current.registerEvent(
        WalletEvent.ACCOUNT_CHANGED,
        handleWalletEvents
      );
      // walletManagerRef.current.registerEvent(WalletEvent.CHAIN_CHANGED, handleWalletEvents)
    }

    return () => {
      walletManagerRef.current &&
        walletManagerRef.current.unregisterEvent(
          WalletEvent.ACCOUNT_CHANGED,
          handleWalletEvents
        );
      // walletManagerRef.current && walletManagerRef.current.registerEvent(WalletEvent.CHAIN_CHANGED, handleWalletEvents)
    };
  }, [walletManager]);

  useEffect(() => {
    if (walletManager && walletManager.isConnected() && user.walletAddress) {
      getWalletBalance();
    }
  }, [walletManager, user.walletAddress]);

  const contextValues = useMemo((): IWalletContext => {
    return {
      checkAndSwitchChain,
      connect,
      disconnect,
      walletManager,
      connectedAddress,
      transfer,
      walletBalance,
      getWalletBalance,
    };
  }, [
    connect,
    disconnect,
    checkAndSwitchChain,
    walletManager,
    connectedAddress,
    transfer,
    walletBalance,
    getWalletBalance,
  ]);

  return (
    <WalletContext.Provider value={contextValues}>
      {children}
    </WalletContext.Provider>
  );
};
