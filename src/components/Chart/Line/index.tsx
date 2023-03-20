import { ChartOptions } from 'chart.js/auto';
import React, { useRef } from 'react';
import { Line } from 'react-chartjs-2';
// import { Chart } from 'chart.js/auto';
import 'chart.js/auto';
import { TChartData } from '@interfaces/chart/data';

type LineChartProps = {
  chartData: TChartData;
};

const LineChart: React.FC<LineChartProps> = ({ chartData }) => {
  const ref = useRef();

  const chartOptions: ChartOptions<'line'> = {
    scales: {
      x: {
        title: {
          display: false,
          text: 'Time',
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: false,
          text: 'Sales',
        },
        ticks: {
          count: 5,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    aspectRatio: 1,
    elements: {
      point: {
        backgroundColor: '#4F43E2',
      },
    },
  };

  return (
    <div>
      <Line ref={ref} data={chartData} options={chartOptions} />
    </div>
  );
};

export default LineChart;
