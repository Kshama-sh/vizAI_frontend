import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import useQueryStore from "@/store/queryStore";

function Dashboard() {
  const { savedVisualizations } = useQueryStore();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Saved Visualizations</h1>

      {savedVisualizations.length === 0 ? (
        <p className="text-gray-500 text-center">
          No saved visualizations yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {savedVisualizations.map((viz, index) => (
            <Card key={index} className="p-4 shadow-lg rounded-lg">
              <CardHeader className="text-lg font-semibold text-center">
                {viz.title}
              </CardHeader>
              <CardContent className="text-gray-600 text-center">
                {viz.description || "Visualization of query results"}
              </CardContent>
              <CardFooter className="flex justify-center">
                <Link to="/Visualisation">
                  <Button>View</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
