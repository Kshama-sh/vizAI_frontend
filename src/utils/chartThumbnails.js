import barChart from "/assets/thumbnails/bar-chart.png";
import lineChart from "/assets/thumbnails/line-chart.png";
import pieChart from "/assets/thumbnails/pie-chart.png";
import scatterPlot from "/assets/thumbnails/scatter-plot.png";
import areaChart from "/assets/thumbnails/area-chart.png";
import donutChart from "/assets/thumbnails/donut-chart.png";

const chartThumbnails = {
  bar: barChart,
  line: lineChart,
  pie: pieChart,
  scatter: scatterPlot,
  area: areaChart,
  donut: donutChart,
};

export default function getChartThumbnail(chart_type) {
  return chartThumbnails[chart_type?.toLowerCase()] || null;
}
