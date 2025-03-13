import React from "react";
import Chart from "react-apexcharts";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useQueryStore from "@/store/queryStore";

const Visualisation = () => {
  const { selectedQuery } = useQueryStore();

  if (!selectedQuery) {
    return (
      <div className="text-center text-gray-500 p-6 text-lg">
        No query selected.
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 p-6">
      <Card className="p-5 shadow-lg rounded-2xl bg-amber-100 dark:bg-gray-900">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {selectedQuery.title}
          </h3>
        </CardHeader>
        <CardContent>
          <DynamicChart
            data={selectedQuery.data}
            chartType={selectedQuery.chartType}
          />
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button className="bg-orange-300 hover:bg-orange-400 text-white px-4 py-2 rounded-lg">
            Save to Dashboard
          </Button>
        </CardFooter>
      </Card>
      <Card className="p-5 shadow-lg rounded-2xl bg-amber-100">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-800">
            Visualisation Summary
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{selectedQuery.report}</p>
        </CardContent>
      </Card>
    </div>
  );
};

const DynamicChart = ({ data, chartType }) => {
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
    <Chart
      options={chartOptions}
      series={chartSeries}
      type={chartType}
      height={400}
    />
  );
};

export default Visualisation;
