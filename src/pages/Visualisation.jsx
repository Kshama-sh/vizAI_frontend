import React, { useState } from "react";
import Chart from "react-apexcharts";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useQueryStore from "@/store/queryStore";

const queryResults = [
  {
    title: "Total Salary Expenditure Over Time",
    chartType: "line",
    data: [
      { label: "1987-06", value: 24000 },
      { label: "1987-09", value: 4400 },
      { label: "1989-09", value: 17000 },
      { label: "1990-01", value: 9000 },
      { label: "1991-05", value: 6000 },
      { label: "1993-01", value: 17000 },
      { label: "1994-06", value: 36800 },
    ],
  },
  {
    title: "Average Salary by Department",
    chartType: "bar",
    data: [
      { label: "Executive", value: 19333 },
      { label: "IT", value: 5760 },
      { label: "Finance", value: 8600 },
      { label: "Purchasing", value: 4150 },
      { label: "Shipping", value: 5885 },
    ],
  },
  {
    title: "Quarterly Salary Expenditure Trend",
    chartType: "area",
    data: [
      { label: "1987-Q2", value: 24000 },
      { label: "1987-Q3", value: 4400 },
      { label: "1989-Q3", value: 17000 },
      { label: "1990-Q1", value: 9000 },
    ],
  },
  {
    title: "Yearly Average Salary by Job Title",
    chartType: "line",
    data: [
      { label: "President - 1987", value: 24000 },
      { label: "Vice President - 1989", value: 17000 },
      { label: "Programmer - 1990", value: 9000 },
      { label: "Finance Manager - 1994", value: 12000 },
    ],
  },
  {
    title: "Monthly Salary Expenditure by Department",
    chartType: "line",
    data: [
      { label: "Accounting - 6", value: 20300 },
      { label: "Administration - 9", value: 4400 },
      { label: "Executive - 1", value: 17000 },
    ],
  },
  {
    title: "Salary Distribution Across Departments",
    chartType: "bar",
    data: [
      { label: "Administration", value: 4400 },
      { label: "Marketing", value: 9500 },
      { label: "IT", value: 5760 },
    ],
  },
  {
    title: "Salary Range for Job Titles",
    chartType: "bar",
    data: [
      { label: "Public Accountant", value: 9000 },
      { label: "President", value: 40000 },
      { label: "Programmer", value: 10000 },
    ],
  },
  {
    title: "Employee Count by Department",
    chartType: "pie",
    data: [
      { label: "Administration", value: 1 },
      { label: "Marketing", value: 2 },
      { label: "Finance", value: 6 },
    ],
  },
  {
    title: "Min-to-Max Salary Ratio",
    chartType: "bar",
    data: [
      { label: "Public Accountant", value: 0.47 },
      { label: "Marketing Manager", value: 0.6 },
    ],
  },
  {
    title: "Average Salary vs Minimum Salary",
    chartType: "scatter",
    data: [
      { label: "4200", value: 7983 },
      { label: "8000", value: 12000 },
      { label: "3000", value: 4400 },
      { label: "20000", value: 24000 },
    ],
  },
];

function Visualisation() {
  const [selectedQuery, setSelectedQuery] = useState(null);
  const { addVisualization, removeVisualization, savedVisualizations } =
    useQueryStore();

  const handleSaveVisualization = () => {
    if (selectedQuery) addVisualization(selectedQuery);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {queryResults.map((query, index) => (
          <Button key={index} onClick={() => setSelectedQuery(query)}>
            {query.title}
          </Button>
        ))}
      </div>

      {/* Chart Display */}
      {selectedQuery && (
        <Card className="p-4 shadow-md">
          <CardHeader>
            <h3 className="text-lg font-semibold">{selectedQuery.title}</h3>
          </CardHeader>
          <CardContent>
            <DynamicChart
              data={selectedQuery.data}
              chartType={selectedQuery.chartType}
            />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={handleSaveVisualization}>Save to Dashboard</Button>
          </CardFooter>
        </Card>
      )}

      {/* Saved Visualizations */}
      {savedVisualizations.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mt-6">Saved Visualizations</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {savedVisualizations.map((viz, index) => (
              <Card key={index} className="p-4 shadow-md">
                <CardHeader>{viz.title}</CardHeader>
                <CardContent>
                  <DynamicChart data={viz.data} chartType={viz.chartType} />
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button
                    variant="destructive"
                    onClick={() => removeVisualization(viz.title)}
                  >
                    Remove
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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

export default Visualisation;
