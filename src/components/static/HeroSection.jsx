import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <main className="bg-white flex flex-col gap-10 sm:gap-20 py-10 sm:py-20 items-center text-center w-full ">
      <section className="bg-opacity-50">
        <h1 className="font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tighter py-4">
          AI-Powered Dashboard Insights
        </h1>
        <p className="text-gray-600 sm:mt-4 text-sm sm:text-lg max-w-2xl mx-auto">
          Automate your reports and visualizations with AI-driven analytics.
        </p>
      </section>
      <div className="flex gap-6 bg-opacity-50">
        <Link to="/Signup">
          <Button className="text-white bg-[#230C33] hover:bg-[#C4BEEE] px-6 py-3 text-lg sm:text-xl rounded-lg">
            Get Started
          </Button>
        </Link>
      </div>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <Card className="bg-[#B4ADEA]">
          <CardHeader>
            <CardTitle className="font-bold text-xl">For Analysts</CardTitle>
          </CardHeader>
          <CardContent>
            Generate insightful reports and dashboards in seconds.
          </CardContent>
        </Card>
        <Card className="bg-[#B4ADEA] ">
          <CardHeader>
            <CardTitle className="font-bold text-xl">For Businesses</CardTitle>
          </CardHeader>
          <CardContent>
            Visualize your data and make informed decisions effortlessly.
          </CardContent>
        </Card>
      </section>
      <img
        src="src/assets/chart.png"
        className="max-w-5xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 "
        alt="Dashboard Preview"
      />

      <section>
        <div>
          {" "}
          <h1 className="font-bold text-lg">
            VizAI connects to multiple databases, enabling you to query diverse
            data sources.
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 max-w-4xl mx-auto p-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow rounded-2xl bg-[#230C33]">
            <CardContent className="flex items-center justify-center h-36">
              <img
                src="src/assets/mysql_logo.svg"
                alt="MySQL"
                className="max-h-full object-contain"
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow rounded-2xl bg-[#230C33]">
            <CardContent className="flex items-center justify-center h-36">
              <img
                src="src/assets/postgresql-logo.png"
                alt="Postgres"
                className="max-h-full object-contain"
              />
            </CardContent>
          </Card>

          {/* <Card className="shadow-lg hover:shadow-xl transition-shadow rounded-2xl bg-[#230C33]">
            <CardContent className="flex items-center justify-center h-36">
              <img
                src="src/assets/sqlite-logo.png"
                alt="SQLite"
                className="max-h-full object-contain"
              />
            </CardContent>
          </Card> */}
        </div>
      </section>
    </main>
  );
};
export default HeroSection;
