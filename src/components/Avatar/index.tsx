import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import Image from 'next/image';
import React from 'react';
import styles from './styles.module.scss';
import { v4 } from 'uuid';

type Props = {
  imgSrcs: string | string[];
  width?: number;
  height?: number;
};

const Avatar = ({ imgSrcs, width = 48, height = 48 }: Props) => {
  const SingleAvatar = ({ src }: { src: string }) => {
    return (
      <div style={{ width, height }}>
        {src ? (
          <Image src={src} alt="user avatar" width={width} height={height} />
        ) : (
          <div className={styles.defaultAvatar}>
            <SvgInset
              size={width}
              svgUrl={`${CDN_URL}/images/default-avatar.svg`}
            ></SvgInset>
          </div>
        )}
      </div>
    );
  };

  if (imgSrcs && typeof imgSrcs === 'string')
    return <SingleAvatar src={imgSrcs} />;

  if (imgSrcs?.length > 0 && typeof imgSrcs === 'object') {
    return (
      <div className={styles.avatarStack}>
        {imgSrcs.map(src => (
          <SingleAvatar src={src} key={`avatar-${v4()}`} />
        ))}
      </div>
    );
  }

  return null;
};

export default Avatar;
