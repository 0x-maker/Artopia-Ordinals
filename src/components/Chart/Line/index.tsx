import { ChartOptions } from 'chart.js/auto';
import React, { useRef } from 'react';
import { Line } from 'react-chartjs-2';
// import { Chart } from 'chart.js/auto';
import 'chart.js/auto';
import { TChartData } from '@interfaces/chart/data';
import dayjs from 'dayjs';

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
        ticks: {
          color: '#fff',
        },
      },
      y: {
        title: {
          display: false,
          text: 'Sales',
        },
        ticks: {
          count: 5,
          // beginAtZero: true,
          mirror: true,
          color: '#fff',
          // padding: -25,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#333',
        bodyColor: '#fff',
        titleColor: '#fff',
        cornerRadius: 2,
        displayColors: false,
        borderColor: '#0000001a',
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            const currentYear = new Date().getFullYear();
            const date = new Date(context.label);
            return dayjs(date).format(`M-DD-${currentYear}`);
            // return `${context.formattedValue} BTC`;
          },
          title(tooltipItems) {
            return `${tooltipItems[0].formattedValue} BTC`;
          },
        },
      },
    },

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
