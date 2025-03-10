import React, { useState } from "react";
import Chart from "react-apexcharts";
import { Card } from "@/components/ui/card";

function QueryVisualiser() {
  const [queryResults, setQueryResults] = useState([
    {
      title: "Sales Over Time",
      chartType: "line",
      data: [
        { label: "Jan", value: 100 },
        { label: "Feb", value: 120 },
        { label: "Mar", value: 140 },
      ],
    },
    {
      title: "Product Distribution",
      chartType: "pie",
      data: [
        { label: "Product A", value: 50 },
        { label: "Product B", value: 30 },
        { label: "Product C", value: 20 },
      ],
    },
    {
      title: "Users by Region",
      chartType: "bar",
      data: [
        { label: "USA", value: 300 },
        { label: "India", value: 400 },
        { label: "UK", value: 250 },
      ],
    },
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {queryResults.map((query, index) => (
        <Card key={index} className="p-4 shadow-md">
          <h3 className="text-lg font-semibold">{query.title}</h3>
          <DynamicChart data={query.data} chartType={query.chartType} />
        </Card>
      ))}
    </div>
  );
}

const DynamicChart = ({ data, chartType }) => {
  let chartOptions;
  let chartSeries;

  if (chartType === "donut" || chartType === "pie") {
    chartOptions = {
      labels: data.map((item) => item.label),
    };
    chartSeries = data.map((item) => item.value);
  } else {
    chartOptions = {
      chart: { type: chartType },
      xaxis: { categories: data.map((item) => item.label) },
    };
    chartSeries = [{ name: "Value", data: data.map((item) => item.value) }];
  }

  return (
    <Chart
      options={chartOptions}
      series={chartSeries}
      type={chartType}
      height={300}
    />
  );
};

export default QueryVisualiser;
