import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, X, ChevronLeft, ChevronRight } from "lucide-react";
import useQueryStore from "@/store/queryStore";
import DynamicChart from "../components/static/DynamicChart";

function Dashboard() {
  const { dashboardQueries, removeFromDashboard } = useQueryStore();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboards, setDashboards] = useState([
    { id: 1, name: "Main Dashboard", isActive: true },
    { id: 2, name: "Dashboad 2", isActive: false },
  ]);
  const [newDashboardName, setNewDashboardName] = useState("");

  // Load dashboards from localStorage on component mount
  useEffect(() => {
    const savedDashboards = localStorage.getItem("dashboards");
    if (savedDashboards) {
      setDashboards(JSON.parse(savedDashboards));
    }
  }, []);

  // Save dashboards to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("dashboards", JSON.stringify(dashboards));
  }, [dashboards]);

  const handleCreateDashboard = () => {
    if (newDashboardName.trim()) {
      // Deactivate all current dashboards
      const updatedDashboards = dashboards.map((dashboard) => ({
        ...dashboard,
        isActive: false,
      }));

      // Add new dashboard as active
      const newDashboard = {
        id: Date.now(),
        name: newDashboardName.trim(),
        isActive: true,
      };

      setDashboards([...updatedDashboards, newDashboard]);
      setNewDashboardName("");
    }
  };

  const switchDashboard = (id) => {
    const updatedDashboards = dashboards.map((dashboard) => ({
      ...dashboard,
      isActive: dashboard.id === id,
    }));
    setDashboards(updatedDashboards);
  };

  const deleteDashboard = (id) => {
    if (dashboards.length <= 1) return;

    const filteredDashboards = dashboards.filter(
      (dashboard) => dashboard.id !== id
    );

    if (
      dashboards.find((d) => d.id === id)?.isActive &&
      filteredDashboards.length > 0
    ) {
      filteredDashboards[0].isActive = true;
    }

    setDashboards(filteredDashboards);
  };
  const activeDashboard = dashboards.find((d) => d.isActive) || dashboards[0];
  console.log("Dashboard Queries:", dashboardQueries);

  return (
    <div>
      <div className="flex gap-4 items-end mb-6 justify-center mt-4">
        <div>
          <Label>Start Date</Label>
          <input
            type="month"
            // value={dateRange.startDate}
            // onChange={(e) => handleDateRangeChange("startDate", e.target.value)}
            className="border p-2 rounded"
            placeholder="Start Date"
          />
        </div>
        <div>
          <Label>End Date</Label>
          <input
            type="month"
            // value={dateRange.endDate}
            // onChange={(e) => handleDateRangeChange("endDate", e.target.value)}
            className="border p-2 rounded"
            placeholder="End Date"
          />
        </div>
        <Button
        // onClick={applyDateRange}
        // disabled={!dateRange.startDate && !dateRange.endDate}
        >
          Apply Date Range
        </Button>
      </div>
      <div className="flex h-screen">
        <Button
          className="fixed top-20 left-0 z-10 p-2 bg-gray-200 rounded-r-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </Button>

        {/* Sidebar */}
        <div
          className={`w-64 bg-gray-100 p-4 transition-all duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed left-0 top-0 h-full z-20 shadow-lg`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Dashboards</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={18} />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Dashboard List */}
            <div className="space-y-2">
              {dashboards.map((dashboard) => (
                <div
                  key={dashboard.id}
                  className={`flex justify-between items-center p-2 rounded-md cursor-pointer ${
                    dashboard.isActive
                      ? "bg-blue-100 border-l-4 border-blue-500"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => switchDashboard(dashboard.id)}
                >
                  <span className="truncate">{dashboard.name}</span>
                  {dashboards.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDashboard(dashboard.id);
                      }}
                      className="opacity-70 hover:opacity-100"
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Create New Dashboard */}
            <div className="pt-4 border-t">
              <Label htmlFor="dashboard-name">Create New Dashboard</Label>
              <div className="flex mt-2">
                <Input
                  id="dashboard-name"
                  value={newDashboardName}
                  onChange={(e) => setNewDashboardName(e.target.value)}
                  placeholder="Dashboard name"
                  className="mr-2"
                />
                <Button onClick={handleCreateDashboard} size="sm">
                  <PlusCircle size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`flex-1 p-6 transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              {activeDashboard?.name || "Dashboard"}
            </h1>
          </div>

          {dashboardQueries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500 mb-4">No visualizations added yet.</p>
              <Button onClick={() => (window.location.href = "/Query")}>
                Go to Query Page
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dashboardQueries.map((query) => (
                <Card
                  key={query.id}
                  className="relative overflow-hidden"
                  onMouseEnter={() => setHoveredCard(query.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {hoveredCard === query.id && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 z-10"
                      onClick={() => removeFromDashboard(query.id)}
                    >
                      <X size={16} />
                    </Button>
                  )}
                  <CardHeader className="font-medium pb-2">
                    {query.title || query.explanation || "Visualization"}
                  </CardHeader>
                  <CardContent>
                    <DynamicChart
                      data={query.data}
                      chartType={query.chartType}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
