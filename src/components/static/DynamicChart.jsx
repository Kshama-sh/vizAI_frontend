import React from "react";
import Chart from "react-apexcharts";

const DynamicChart = ({ data, chartType }) => {
  if (!data || data.length === 0) {
    return (
      <p className="text-center text-gray-500">No chart data available.</p>
    );
  }

  let chartOptions;
  let chartSeries;

  if (chartType === "donut" || chartType === "pie") {
    chartOptions = { labels: data.map((item) => item.label) };
    chartSeries = data.map((item) => item.value);
  } else {
    chartOptions = {
      chart: { type: chartType },
      xaxis: { categories: data.map((item) => item.label) },
      colors: ["#2563eb"],
      stroke: { curve: "smooth" },
    };
    chartSeries = [{ name: "Value", data: data.map((item) => item.value) }];
  }

  return (
    <div className="w-full">
      <Chart
        options={chartOptions}
        series={chartSeries}
        type={chartType}
        height={400}
      />
    </div>
  );
};

export default DynamicChart;
