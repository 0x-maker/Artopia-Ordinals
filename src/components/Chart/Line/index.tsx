import { ChartOptions } from 'chart.js/auto';
import React, { useRef } from 'react';
import { Line } from 'react-chartjs-2';
// import { Chart } from 'chart.js/auto';
import 'chart.js/auto';

// type ChartData = {
//   labels: string[];
//   datasets: {
//     label: string;
//     data: number[];
//     fill: boolean;
//     borderColor: string;
//     tension: number;
//   }[];
// };

// type LineChartProps = {
//   chartData: ChartData;
// };

const LineChart: React.FC = () =>
  // { chartData }
  {
    const ref = useRef();
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Sales',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    };

    const chartOptions: ChartOptions<'line'> = {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Time',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Sales',
          },
          min: 0,
          max: 100,
        },
      },
    };

    return (
      <div>
        <Line ref={ref} data={data} options={chartOptions} />
      </div>
    );
  };

export default LineChart;
