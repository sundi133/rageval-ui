// BarChart.js
import React from 'react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const LineChart = ({ data_series, retrieval_series, title }) => {
  if (!data_series || !data_series.length || !data_series[0].data) {
    return <div>No data available</div>;
  }

  if (!retrieval_series || !retrieval_series.length) {
    return <div>No retrieval data available</div>;
  }

  const options = {
    chart: {
      type: 'line'
    },
    xaxis: {
      categories: data_series[0].data.map((item) => item.x)
    },
    yaxis: {
      tickAmount: 5,
      labels: {
        formatter: function (value) {
          if (value) {
            return value.toFixed(4);
          } else {
            return 0;
          }
          //return value ? value.toFixed(4) : 0;
        }
      }
    },
    markers: {
      size: 5,
      style: 'hollow'
    },
    stroke: {
      curve: 'smooth',
      width: 4,
    },
    tooltip: {
      enabled: true,
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
        const additionalInfo = data.simulationRunId; // Replace 'additionalData' with the actual key of the additional data
        return `<div class="tooltip">
                  <span>Date: ${data.x}</span><br/>
                  <span>Score: ${data.y}</span><br/>
                  <span>Simulation Run Id: ${additionalInfo}</span>
                </div>`;
      }
    },
    grid: {
      show: false,
      padding: {
        left: 0,
        right: 0
      }
    },
    title: {
      text: title, // Set the chart title
      align: 'center',
      style: {
        fontSize: '12px',
        fontWeight: 'semibold'
      },
      margin: 10,
      offsetX: 0,
      offsetY: 0
    }
  };

  const combinedSeries = [
    ...data_series,
    ...retrieval_series
  ];
  console.log(combinedSeries);

  return (
    <Chart
      options={options}
      series={combinedSeries}
      type="line"
      height={300}
      style={{ marginTop: '4px' }}
    />
  );
};

export default LineChart;
