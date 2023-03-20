import LineChart from '@components/Chart/Line';
import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { CDN_URL } from '@constants/config';
import { LogLevel } from '@enums/log-level';
import { TChartData } from '@interfaces/chart/data';
import { getSalesVolume } from '@services/shop';
import { formatBTCPrice } from '@utils/format';
import log from '@utils/logger';
import cs from 'classnames';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import s from './ActivityChart.module.scss';

enum chartFilters {
  // ONE_DAY = 'day',
  SEVEN_DAY = 'week',
  ONE_MONTH = 'month',
}

const LOG_PREFIX = 'ActivityChart';

const ActivityChart = () => {
  const [filter, setFilter] = useState(chartFilters.SEVEN_DAY);
  const [chartData, setChartData] = useState<TChartData>();
  const router = useRouter();

  const { projectID } = router.query as { projectID: string };

  // const data = {
  //   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  //   datasets: [
  //     {
  //       label: 'Sales',
  //       data: [65, 59, 80, 81, 56, 55, 40],
  //       fill: false,
  //       borderColor: 'rgb(75, 192, 192)',
  //       tension: 0.1,
  //     },
  //   ],
  // };

  const handleFetchChartData = async () => {
    if (projectID) {
      try {
        const response = await getSalesVolume(
          { projectID },
          { dateRange: filter }
        );

        if (response) {
          const { volumns } = response;

          const labels = volumns.map(item =>
            dayjs(item.timestamp).format('M/DD')
          );
          const data = volumns.map(item => formatBTCPrice(item.amount));

          setChartData({
            labels,
            datasets: [
              {
                label: '',
                data,
                fill: false,
                borderColor: '#4F43E2',
                tension: 0.1,
              },
            ],
          });
        }
      } catch (err: unknown) {
        log('failed to fetch chart data', LogLevel.ERROR, LOG_PREFIX);
        throw Error();
      }
    }
  };

  useEffect(() => {
    handleFetchChartData();
  }, [projectID, filter]);

  if (!projectID || !chartData) {
    return null;
  }

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
          {/* <div
            className={cs(s.chart_filters_item, {
              [`${s.active}`]: filter === chartFilters.ONE_DAY,
            })}
            onClick={() => setFilter(chartFilters.ONE_DAY)}
          >
            <Text size="14" fontWeight="medium">
              1D
            </Text>
          </div> */}
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
      <div className={s.wrapper_chart}>
        <LineChart chartData={chartData} />
      </div>
    </div>
  );
};

export default ActivityChart;
