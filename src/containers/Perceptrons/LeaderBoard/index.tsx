import Table from '@components/Table';
import { formatAddressDisplayName } from '@utils/format';
import s from './styles.module.scss';

const LEADER_BOARD = ['Position', 'Name', 'Alpha boost', 'Points'];
const FAKE_DATA = [
  {
    position: 19,
    name: 'You',
    alpha_boost: 1,
    points: 1500,
  },
  {
    position: 2,
    name: '0x63f674814Ab1329f05D2B9237Bc03C9c87ded2Aa',
    alpha_boost: 1,
    points: 1000,
  },
  {
    position: 10,
    name: '0x63f674814Ab1329f05D2B9237Bc03C9c87ded2Aa',
    alpha_boost: 1,
    points: 700,
  },
  {
    position: 25,
    name: '0x63f674814Ab1329f05D2B9237Bc03C9c87ded2Aa',
    alpha_boost: 2,
    points: 500,
  },
  {
    position: 100,
    name: '0x63f674814Ab1329f05D2B9237Bc03C9c87ded2Aa',
    alpha_boost: 1,
    points: 300,
  },
];

const LeaderBoard = () => {
  // if (!tokenActivities?.result)
  //   return <NotFound infoText="No leaderboard yet" />;
  const fakeDatas = FAKE_DATA.map((leaderboard, index) => {
    return {
      id: `leaderboard-${index}`,
      render: {
        position: <>{leaderboard.position}</>,
        name: <>{formatAddressDisplayName(leaderboard.name)}</>,
        alpha_boost: <>{leaderboard.alpha_boost}x</>,
        points: <>{leaderboard.points} ⭐️ </>,
      },
    };
  });

  return (
    <Table
      className={s.leaderBoardTable}
      tableHead={LEADER_BOARD}
      data={fakeDatas}
    />
  );
};

export default LeaderBoard;
