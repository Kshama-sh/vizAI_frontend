import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import useQueryStore from "@/store/queryStore";
import DynamicChart from "../components/static/DynamicChart";
// import { Navigate, useNavigate } from "react-router-dom";
function Dashboard() {
  const { dashboardQueries, removeFromDashboard } = useQueryStore();
  const [hoveredCard, setHoveredCard] = useState(null);
  // const navigate = useNavigate();

  return (
    <div className="p-6">
      {dashboardQueries.length === 0 ? (
        <p className="text-gray-500 text-center">
          No visualizations added yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {dashboardQueries.map((query) => (
            <Card
              key={query.id}
              className="p-4 border rounded-2xl hover:shadow-2xl relative transition-all duration-300"
              onMouseEnter={() => setHoveredCard(query.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {hoveredCard === query.id && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 bg-white/70 hover:bg-white shadow-md rounded-full p-2"
                  onClick={() => removeFromDashboard(query.id)}
                >
                  <X className="h-5 w-5 text-gray-500 hover:text-red-500 transition-all" />
                </Button>
              )}

              <CardHeader className="text-xs font-semibold text-center">
                {query.title}
              </CardHeader>
              <CardContent>
                <DynamicChart data={query.data} chartType={query.chartType} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
