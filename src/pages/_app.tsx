import ToastOverlay from '@components/ToastOverlay';
import AuthWrapper from '@components/Utils/AuthWrapper';
import { STANDALONE_PAGES } from '@constants/route-path';
import {
  SEO_DESCRIPTION,
  SEO_IMAGE,
  SEO_TITLE,
} from '@constants/seo-default-info';
import { WalletProvider } from '@contexts/wallet-context';
import { AssetsProvider } from '@contexts/assets-context';
import { LogLevel } from '@enums/log-level';
import store from '@redux';
import { sendAAPageView } from '@services/aa-tracking';
import DatadogService from '@services/datadog';
import '@styles/index.scss';
import log from '@utils/logger';
import { getReferralCodeURLParameter, setReferral } from '@utils/referral';
import { NextComponentType, NextPageContext } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NextNprogress from 'nextjs-progressbar';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { SSRProvider } from 'react-bootstrap';

interface MyAppProps extends AppProps {
  Component: {
    Layout?: React.ExoticComponent<{
      children?: React.ReactNode;
    }>;
  } & NextComponentType<NextPageContext, unknown, unknown>;
}

export default function App({ Component, pageProps }: MyAppProps) {
  const router = useRouter();
  const { seoInfo = {} } = pageProps;
  const { title, description, image } = seoInfo;
  const { pathname } = useRouter();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .catch(function (err) {
          log(err as Error, LogLevel.ERROR, 'App');
        });
    }
  }, []);

  useEffect(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, []);

  useEffect(() => {
    sendAAPageView({ page: window.location.pathname });
  }, [router.asPath]);

  useEffect(() => {
    const refCode = getReferralCodeURLParameter();
    if (refCode) {
      setReferral(refCode);
    }
  }, []);

  useEffect(() => {
    const ddInstance = DatadogService.getInstance();
    ddInstance.init();
    ddInstance.startRUMTracking();

    return () => {
      ddInstance.stopRUMTracking();
    };
  }, []);

  const renderBody = () => {
    if (STANDALONE_PAGES.includes(pathname)) {
      return (
        <SSRProvider>
          <Component {...pageProps} />
        </SSRProvider>
      );
    }
    return (
      <SSRProvider>
        <Provider store={store}>
          <WalletProvider>
            <AuthWrapper>
              <AssetsProvider>
                <Component {...pageProps} />
                <ToastOverlay />
              </AssetsProvider>
            </AuthWrapper>
          </WalletProvider>
        </Provider>
      </SSRProvider>
    );
  };

  return (
    <>
      <Head>
        <title>{title ?? SEO_TITLE}</title>
        <meta property="og:title" content={title ?? SEO_TITLE} />
        <meta
          property="og:description"
          content={description ?? SEO_DESCRIPTION}
        />
        <meta property="og:image" content={image ?? SEO_IMAGE} />
        <meta property="og:type" content="website" />
        <meta property="twitter:title" content={title ?? SEO_TITLE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:description"
          content={description ?? SEO_DESCRIPTION}
        />
        <meta name="twitter:image" content={image ?? SEO_IMAGE} />
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />

        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#fff" />
        <meta name="theme-color" content="#ffffff"></meta>

        <link rel="shortcut icon" href="/images/favicon.ico" />
        <link rel="icon" sizes="16x16 32x32 64x64" href="/images/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="196x196"
          href="/images/favicon-192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="160x160"
          href="/images/favicon-160.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/images/favicon-96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="64x64"
          href="/images/favicon-64.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon-32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16.png"
        />
        <link rel="apple-touch-icon" href="/images/favicon-57.png" />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/images/favicon-114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/images/favicon-72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/images/favicon-144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/images/favicon-60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/images/favicon-120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/images/favicon-76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/images/favicon-152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/favicon-180.png"
        />
        <meta name="msapplication-TileColor" content="#FFFFFF" />
        <meta name="msapplication-TileImage" content="images/favicon-144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </Head>

      <NextNprogress />
      {renderBody()}
    </>
  );
}
