import React from "react";
import Chart from "react-apexcharts";

const DynamicChart = ({ data = [], chartType = "bar" }) => {
  console.log("Chart Data Received:", data, "Chart Type:", chartType);
  console.log("Chart Data Received:", data);
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <p className="text-center text-gray-500">No chart data available.</p>
    );
  }

  const normalizedChartType = chartType.toLowerCase();

  let chartOptions = {};
  let chartSeries = [];

  if (normalizedChartType === "donut" || normalizedChartType === "pie") {
    chartOptions = {
      labels: data.map((item) => item.label),
      legend: { position: "bottom" },
    };
    chartSeries = data.map((item) => item.value);
  } else {
    chartOptions = {
      chart: {
        type: normalizedChartType,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
        },
        zoom: { enabled: true },
      },
      xaxis: { categories: data.map((item) => item.label) },
      colors: ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
      stroke: { curve: "smooth" },
      dataLabels: { enabled: true },
      tooltip: { enabled: true },
    };
    chartSeries = [{ name: "data", data: data.map((item) => item.value) }];
  }

  return (
    <div className="w-full">
      <Chart
        options={chartOptions}
        series={chartSeries}
        type={normalizedChartType}
        height={400}
      />
    </div>
  );
};

export default DynamicChart;
