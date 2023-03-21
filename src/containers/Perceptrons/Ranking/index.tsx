import s from './styles.module.scss';
import Text from '@components/Text';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import { ReactNode } from 'react';
import Link from 'next/link';

interface IProps {
  heading: string;
  children: ReactNode;
  points: string;
  pointLabel?: string;
  url: string;
}
export const Ranking = ({
  heading,
  children,
  points,
  pointLabel,
  url,
}: IProps): JSX.Element => {
  return (
    <Link href={url} className={s.ranking}>
      <div className={s.ranking_inner}>
        <div className={s.ranking_left}>
          <Text as={'h4'} size={'24'} color={'white'}>
            {heading}
          </Text>
          <Text as={'p'} size={'16'} color={'black-40-solid'}>
            {children}
          </Text>
        </div>
        <div className={s.ranking_right}>
          <div className={s.ranking_right_inner}>
            <div className={s.pointValue}>
              <Text as={'p'} size={'20'} color={'white'}>
                {points} points ⭐
              </Text>
              <Text as={'p'} size={'16'} color={'black-40-solid'}>
                {pointLabel}
              </Text>
            </div>
            <div className={s.arrow}>
              <SvgInset svgUrl={`${CDN_URL}/icons/ic-arrow-right-18x18.svg`} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
