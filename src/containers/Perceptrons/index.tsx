import { Row } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import React from 'react';
import Heading from '@components/Heading';
import { Ranking } from '@containers/Perceptrons/Ranking';
import PerceptronsSlider from './Slider/index';
import Text from '@components/Text';
import LeaderBoard from '@containers/Perceptrons/LeaderBoard';
import s from './styles.module.scss';

const PerceptronsTemplate = () => {
  return (
    <Container>
      <Row className={`${s.perceptronsContainer} align-items-center`}>
        <div className="col-xxl-5 col-xl-6 col-12 order-xl-0 order-1">
          <Heading className={s.rankingHeading} as="h1" color={'white'}>
            Boost your ranking
          </Heading>
          <div className={s.rankingLists}>
            <Ranking heading={'Join the allowlist'} points={'+100'} url={'#'}>
              To be qualified for minting Percepstrons
            </Ranking>
            <Ranking heading={'Verify your Twitter'} points={'+10'} url={'#'}>
              Verify your Twitter account
            </Ranking>
            <Ranking heading={'Join our Discord'} points={'+10'} url={'#'}>
              Join the community
            </Ranking>
            <Ranking
              heading={'Mint'}
              points={'Unlimited'}
              pointLabel={'+100 points per mint'}
              url={'#'}
            >
              Mint your first inscription on Generative
            </Ranking>
            <Ranking
              heading={'Invite a friend'}
              points={'Unlimited'}
              pointLabel={'+100 points per friend'}
              url={'#'}
            >
              Invite friends who own one of the following NFTs.
            </Ranking>
          </div>
        </div>
        <div className="col-xl-6 offset-xxl-1 col-12 order-xl-1 order-0">
          <PerceptronsSlider />
        </div>
      </Row>
      <div className={`row justify-content-center ${s.leaderboard}`}>
        <div className="col-xxl-6 col-xl-10 col-12 text-center">
          <Heading className={s.leaderboard_header} as="h1" color={'white'}>
            Leaderboard
          </Heading>
          <Text
            className={s.leaderboard_desc}
            as={'p'}
            size={'20'}
            color={'black-40-solid'}
          >
            Get to the top of the leaderboard to boots your points. Invite
            friends with large NFT volume to get more points.
          </Text>
          <LeaderBoard />
        </div>
      </div>
    </Container>
  );
};

export default PerceptronsTemplate;
