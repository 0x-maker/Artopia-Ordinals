export type TChartData = {
  labels: string[];
  datasets: {
    label?: string;
    data: Array<string | number>;
    fill: boolean;
    borderColor: string;
    tension: number;
  }[];
};
