import React from 'react';
import SliderSlick from 'react-slick';
import { CDN_URL } from '@constants/config';
import s from './styles.module.scss';

const PerceptronsSlider = () => {
  const settings = {
    customPaging: function (i: number) {
      return (
        <a>
          {i === 0 ? (
            <img
              src={`${CDN_URL}/Screen%20Shot%202023-03-21%20at%2010.43.18%20AM.jpg`}
              alt=""
            />
          ) : (
            <img src={`${CDN_URL}/images/thumbs/${i + 1}.jpg`} alt="" />
          )}
        </a>
      );
    },
    dots: true,
    dotsClass: 'slick-dots slick-thumb',
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className={s.slider}>
      <SliderSlick {...settings}>
        <div>
          <video
            poster={`${CDN_URL}/Screen%20Shot%202023-03-21%20at%2010.43.18%20AM.jpg`}
            src="https://storage.googleapis.com/generative-static-prod/Teaser_GenBrain_01.mp4"
            controls
            preload="auto"
          />
        </div>
        <div>
          <img alt="" src={CDN_URL + '/images/1.jpg'} />
        </div>
        <div>
          <img alt="" src={CDN_URL + '/images/2.jpg'} />
        </div>
        <div>
          <img alt="" src={CDN_URL + '/images/3.jpg'} />
        </div>
        <div>
          <img alt="" src={CDN_URL + '/images/4.jpg'} />
        </div>
        <div>
          <img alt="" src={CDN_URL + '/images/5.jpg'} />
        </div>
      </SliderSlick>
    </div>
  );
};

export default PerceptronsSlider;
