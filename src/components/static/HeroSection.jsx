import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20 items-center text-center w-full ">
      <section>
        <h1 className="font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tighter py-4">
          AI-Powered Dashboard Insights
        </h1>
        <p className="text-gray-600 sm:mt-4 text-sm sm:text-lg max-w-2xl mx-auto">
          Automate your reports and visualizations with AI-driven analytics.
        </p>
      </section>
      <div className="flex gap-6">
        <Link to="/Signup">
          <Button className="text-white px-6 py-3 text-lg sm:text-xl rounded-lg">
            Get Started
          </Button>
        </Link>
      </div>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-bold text-xl">For Analysts</CardTitle>
          </CardHeader>
          <CardContent>
            Generate insightful reports and dashboards in seconds.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-bold text-xl">For Businesses</CardTitle>
          </CardHeader>
          <CardContent>
            Visualize your data and make informed decisions effortlessly.
          </CardContent>
        </Card>
      </section>
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzrdJ8uOj5T51mZdRGB-6H0QizVomAIUcfEw&s"
        className="w-full max-w-5xl rounded-lg shadow-lg"
        alt="Dashboard Preview"
      />
      <section className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-bold text-xl">MySQL</CardTitle>
          </CardHeader>
          <CardContent>
            <img src="" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-bold text-xl">MySQL</CardTitle>
          </CardHeader>
          <CardContent>
            <img src="" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-bold text-xl">MySQL</CardTitle>
          </CardHeader>
          <CardContent>
            <img src="" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-bold text-xl">MySQL</CardTitle>
          </CardHeader>
          <CardContent>
            <img src="" />
          </CardContent>
        </Card>
      </section>
    </main>
  );
};
export default HeroSection;
