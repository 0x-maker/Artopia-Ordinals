import Text from '@components/Text';
import { CDN_URL } from '@constants/config';
import { Col, Row } from 'react-bootstrap';
import s from './styles.module.scss';
import useBTCSignOrd from '@hooks/useBTCSignOrd';
import { useRouter } from 'next/router';
import { Container } from 'react-bootstrap';
import ButtonIcon from '@components/ButtonIcon';
import { ROUTE_PATH } from '@constants/route-path';
import React from 'react';

const AuthenticLanding = () => {
  const { ordAddress, onButtonClick } = useBTCSignOrd();
  const router = useRouter();
  const { next } = router.query;

  const onConnect = () => {
    onButtonClick({});
  };

  React.useEffect(() => {
    if (!ordAddress) return;
    if (next) {
      router.replace(next as string);
    } else {
      router.replace(`${ROUTE_PATH.PROFILE}/${ordAddress}`);
    }
  }, [ordAddress]);

  return (
    <Container>
      <Row className={s.metamaskContainer}>
        <Col md={'12'} xl={'5'} className={s.leftContainer}>
          <p className={s.title}>Certificate of Authenticity</p>
          <Text className={s.subTitle}>
            Create authentic Ordinal Inscriptions from your Ethereum NFTs.
          </Text>
          <Text className={s.text}>
            Generative offers an easy way to inscribe your original Ethereum
            NFTs onto Bitcoin using Ordinals.
            <br />
            <br />
            Securely sync your wallet via MetaMask & Delegate Cash, pick an
            Ethereum NFT, then inscribe it — it’s that easy. You can even sell
            it as authentic Ordinal Inscription on Bitcoin.
            <br />
            <br />
            It’s free.
          </Text>
          <br />
          <br />
          <br />
          <ButtonIcon variants="blue" className={s.login} onClick={onConnect}>
            <img
              src={`${CDN_URL}/icons/ic-metamask.png`}
              className={s.icMetamask}
              alt="ic-metamask"
            />
            Login via MetaMask
          </ButtonIcon>
          <br />
          <br />
          <br />
          <br />
          <Text className={s.text}>
            Generative integrates with{' '}
            <a
              className={s.link}
              href="https://delegate.cash/"
              target={'_blank'}
            >
              delegate.cash
            </a>{' '}
            to prove NFT ownership.
          </Text>
        </Col>
        <Col md={'12'} xl={'7'} className={s.poster}>
          <img alt="banner" src={`${CDN_URL}/images/authentic-poster.png`} />
        </Col>
      </Row>
    </Container>
  );
};

export default AuthenticLanding;
