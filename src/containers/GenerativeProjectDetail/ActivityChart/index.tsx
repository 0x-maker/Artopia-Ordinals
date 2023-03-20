import React, { useState } from 'react';
import s from './ActivityChart.module.scss';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import Text from '@components/Text';
import cs from 'classnames';
import LineChart from '@components/Chart/Line';

enum chartFilters {
  ONE_DAY = '1D',
  SEVEN_DAY = '7D',
  ONE_MONTH = '30D',
}

const ActivityChart = () => {
  const [filter, setFilter] = useState(chartFilters.ONE_DAY);

  return (
    <div className={s.wrapper}>
      <div className={s.wrapper_header}>
        <div className={s.chart_options}>
          <div className={s.chart_options_item}>
            <SvgInset size={18} svgUrl={`${CDN_URL}/icons/ic-chart-line.svg`} />
            <Text size="18" fontWeight="medium">
              Sales
            </Text>
          </div>
        </div>
        <div className={s.chart_filters}>
          <div
            className={cs(s.chart_filters_item, {
              [`${s.active}`]: filter === chartFilters.ONE_DAY,
            })}
            onClick={() => setFilter(chartFilters.ONE_DAY)}
          >
            <Text size="14" fontWeight="medium">
              1D
            </Text>
          </div>
          <div
            className={cs(s.chart_filters_item, {
              [`${s.active}`]: filter === chartFilters.SEVEN_DAY,
            })}
            onClick={() => setFilter(chartFilters.SEVEN_DAY)}
          >
            <Text size="14" fontWeight="medium">
              7D
            </Text>
          </div>
          <div
            className={cs(s.chart_filters_item, {
              [`${s.active}`]: filter === chartFilters.ONE_MONTH,
            })}
            onClick={() => setFilter(chartFilters.ONE_MONTH)}
          >
            <Text size="14" fontWeight="medium">
              30D
            </Text>
          </div>
        </div>
      </div>
      <div className="wrapper_chart">
        <LineChart />
      </div>
    </div>
  );
};

export default ActivityChart;
