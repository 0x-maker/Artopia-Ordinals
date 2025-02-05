import { SOCIALS } from '@constants/common';
import Link from 'next/link';
import React from 'react';
import s from './styles.module.scss';
import { CDN_URL } from '@constants/config';
import cs from 'classnames';
import SvgInset from '@components/SvgInset';
import { ROUTE_PATH } from '@constants/route-path';

const Topbar: React.FC = (): React.ReactElement => {
  return (
    <div className={s.topbar}>
      <div className="container">
        <div className={s.wrapper}>
          <div className={s.left}>
            <p className={s.text}>
              Preserve your valuable Ethereum CryptoArt and NFTs on Bitcoin.
              <Link
                className={s.startedLink}
                href={ROUTE_PATH.PRESERVE_LANDING}
              >
                <span>Learn more</span>
              </Link>
            </p>
          </div>

          <div className={cs(s.right)}>
            <Link
              className={s.socialLink}
              target="_blank"
              href={SOCIALS.discord}
            >
              <SvgInset
                size={18}
                svgUrl={`${CDN_URL}/icons/ic-discord-18x18.svg`}
              />
            </Link>

            <Link
              className={s.socialLink}
              target="_blank"
              href={SOCIALS.twitter}
            >
              <SvgInset
                size={18}
                svgUrl={`${CDN_URL}/icons/ic-twitter-18x18.svg`}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
