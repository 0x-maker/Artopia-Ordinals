import React, { useEffect, useRef, useState } from 'react';
import cs from 'classnames';
import { IMAGE_TYPE, WHITE_LIST } from '@components/NFTDisplayBox/constant';
import s from './styles.module.scss';
import { convertIpfsToHttp } from '@utils/image';

import { LOGO_MARKETPLACE_URL } from '@constants/common';
import Skeleton from '@components/Skeleton';
import { ROUTE_PATH } from '@constants/route-path';
import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';
import { getTokenUri } from '@services/token-uri';
import { GLB_EXTENSION } from '@constants/file';
import { HOST_ORDINALS_EXPLORER } from '@constants/config';

// CDN_URL;
type ContentVariantsType = 'full' | 'absolute';

interface IProps {
  className?: string;
  contentClassName?: string;
  type?: IMAGE_TYPE;
  inscriptionID?: string;
  variants?: ContentVariantsType;
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
}

const NFTDisplayBox = ({
  className,
  contentClassName,
  type,
  inscriptionID,
  variants,
  autoPlay = false,
  loop = false,
  controls = false,
}: IProps) => {
  const [isError, setIsError] = React.useState(false);
  const [isLoaded, serIsLoaded] = React.useState(false);
  const [HTMLContentRender, setHTMLContentRender] = useState<JSX.Element>();
  const imgRef = useRef<HTMLImageElement>(null);

  const onError = () => {
    setIsError(true);
    serIsLoaded(true);
  };

  const onLoaded = () => {
    serIsLoaded(true);
  };

  const getURLContent = () =>
    `${HOST_ORDINALS_EXPLORER}/content/${inscriptionID}`;

  const getURLPreview = () =>
    `${HOST_ORDINALS_EXPLORER}/preview/${inscriptionID}`;

  const contentClass = cs(s.wrapper_content, contentClassName);

  const renderIframe = () => {
    return (
      <iframe
        className={contentClass}
        src={getURLPreview()}
        sandbox="allow-scripts allow-pointer-lock allow-downloads"
        scrolling="no"
        loading="lazy"
        onError={onError}
        onLoad={onLoaded}
      />
    );
  };

  const renderGLBIframe = () => {
    return (
      <iframe
        className={contentClass}
        src={`${ROUTE_PATH.OBJECT_PREVIEW}/${inscriptionID}`}
        scrolling="no"
        loading="lazy"
        onError={onError}
        onLoad={onLoaded}
      />
    );
  };

  const renderAudio = () => {
    return (
      <audio
        controls={controls}
        className={contentClass}
        autoPlay={autoPlay}
        loop={loop}
        src={getURLContent()}
        onError={onError}
        onLoad={onLoaded}
      />
    );
  };

  const renderVideo = () => {
    return (
      <video
        controls={controls}
        autoPlay={autoPlay}
        loop={loop}
        className={contentClass}
        src={getURLContent()}
        onError={onError}
        onLoad={onLoaded}
      />
    );
  };

  const handleOnImgLoaded = (
    evt: React.SyntheticEvent<HTMLImageElement>
  ): void => {
    const img = evt.target as HTMLImageElement;
    const naturalWidth = img.naturalWidth;
    if (naturalWidth < 100 && imgRef.current) {
      imgRef.current.style.imageRendering = 'pixelated';
    }
    serIsLoaded(true);
  };

  const renderImage = () => {
    return (
      <img
        ref={imgRef}
        className={contentClass}
        src={getURLContent()}
        alt={inscriptionID}
        loading="lazy"
        onError={onError}
        onLoad={handleOnImgLoaded}
        style={{ objectFit: 'contain' }}
      />
    );
  };

  const renderWhiteListImage = (link: string) => {
    return (
      <img
        className={contentClass}
        src={link}
        alt={inscriptionID}
        loading="lazy"
        onError={onError}
        onLoad={onLoaded}
        style={{ objectFit: 'contain' }}
      />
    );
  };

  const renderEmpty = () => (
    <img
      src={convertIpfsToHttp(LOGO_MARKETPLACE_URL)}
      alt={inscriptionID}
      loading={'lazy'}
    />
  );

  const renderLoading = () => (
    <Skeleton className={s.absolute} fill isLoaded={isLoaded} />
  );

  const handleRenderHTML = () => {
    if (inscriptionID) {
      getTokenUri({
        contractAddress: GENERATIVE_PROJECT_CONTRACT,
        tokenID: inscriptionID,
      })
        .then(data => {
          const { image } = data;
          const fileExt = image?.split('.').pop();
          if (fileExt && fileExt === GLB_EXTENSION) {
            setHTMLContentRender(renderGLBIframe());
          } else {
            setHTMLContentRender(renderIframe());
          }
        })
        .catch(() => {
          setHTMLContentRender(renderIframe());
        });
    }
  };

  useEffect(() => {
    if (isError) {
      setHTMLContentRender(renderEmpty());
    } else {
      if (inscriptionID) {
        const whiteList = WHITE_LIST.find(
          ({ id }) => !!id && id.toLowerCase() === inscriptionID.toLowerCase()
        );
        if (whiteList) {
          setHTMLContentRender(renderWhiteListImage(whiteList.link));
        }

        switch (type) {
          case 'audio/mpeg':
          case 'audio/wav':
            setHTMLContentRender(renderAudio());
            return;
          case 'video/mp4':
          case 'video/webm':
            setHTMLContentRender(renderVideo());
            return;
          case 'image/apng':
          case 'image/avif':
          case 'image/gif':
          case 'image/jpeg':
          case 'image/png':
          case 'image/svg+xml':
          case 'image/webp':
            setHTMLContentRender(renderImage());
            return;
          case 'model/gltf-binary':
            setHTMLContentRender(renderGLBIframe());
            return;
          case 'model/stl':
          case 'text/html;charset=utf-8':
            handleRenderHTML();
            return;
          case 'application/json':
          case 'application/pgp-signature':
          case 'application/yaml':
          case 'audio/flac':
          case 'application/pdf':
          case 'text/plain;charset=utf-8':
            setHTMLContentRender(renderIframe());
            return;
          default:
            setHTMLContentRender(renderIframe());
            return;
        }
      } else {
        setHTMLContentRender(<></>);
      }
    }
  }, [inscriptionID, isError]);

  if (!inscriptionID || !type) {
    return (
      <div className={cs(s.wrapper, s[`${variants}`], className)}>
        {renderLoading()}
      </div>
    );
  }

  return (
    <div className={cs(s.wrapper, s[`${variants}`], className)}>
      {HTMLContentRender && HTMLContentRender}
      {!isLoaded && renderLoading()}
    </div>
  );
};

export default React.memo(NFTDisplayBox);
