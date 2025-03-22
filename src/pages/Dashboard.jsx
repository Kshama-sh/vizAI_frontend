import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, X, ChevronLeft, ChevronRight } from "lucide-react";
import useQueryStore from "@/store/queryStore";
import DynamicChart from "../components/static/DynamicChart";
import { apiRequest } from "@/api/access_token";

function Dashboard() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboards, setDashboards] = useState([]);
  const [newDashboardName, setNewDashboardName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { dashboardQueries, fetchDashboardChartData, removeFromDashboard } =
    useQueryStore();

  useEffect(() => {
    if (sidebarOpen) {
      fetchUserDashboards();
    }
  }, [sidebarOpen]);

  useEffect(() => {
    const savedDashboards = localStorage.getItem("dashboards");
    if (savedDashboards) {
      setDashboards(JSON.parse(savedDashboards));
    } else {
      setDashboards([
        { id: "default", name: "Main Dashboard", isActive: true },
      ]);
    }
  }, []);

  useEffect(() => {
    if (dashboards.length > 0) {
      localStorage.setItem("dashboards", JSON.stringify(dashboards));
    }
  }, [dashboards]);

  const fetchUserDashboards = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const roleId = localStorage.getItem("user-role");
      if (!roleId) {
        throw new Error("Role ID is required to fetch dashboards.");
      }

      const response = await apiRequest(
        "GET",
        `${import.meta.env.VITE_BACKEND_URL}/execute-query/dashboards`,
        null,
        {
          role_id: roleId,
        }
      );

      if (response && Array.isArray(response)) {
        const formattedDashboards = response.map((dashboard) => ({
          id: dashboard.id,
          name: dashboard.name,
          isActive:
            dashboard.id ===
            (dashboards.find((d) => d.isActive)?.id || response[0].id),
        }));

        if (
          !formattedDashboards.some((d) => d.isActive) &&
          formattedDashboards.length > 0
        ) {
          formattedDashboards[0].isActive = true;
        }

        setDashboards(formattedDashboards);
      } else {
        setDashboards([
          { id: "default", name: "Main Dashboard", isActive: true },
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch dashboards:", error);
      setError(error.message || "Failed to fetch dashboards");

      if (dashboards.length === 0) {
        setDashboards([
          { id: "default", name: "Main Dashboard", isActive: true },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createOrGetDashboard = async () => {
    setLoading(true);

    try {
      const roleId = localStorage.getItem("user-role");
      const dbEntryId = localStorage.getItem("current-db-entry-id");
      if (!roleId) {
        throw new Error("User role is missing.");
      }

      if (!dbEntryId) {
        throw new Error("Database entry ID is missing.");
      }

      const payload = {
        db_entry_id: dbEntryId,
        role_id: roleId,
        name: newDashboardName || `Dashboard ${dashboards.length + 1}`,
      };

      console.log("Sending payload:", payload);

      const endpoint = `${
        import.meta.env.VITE_BACKEND_URL
      }/execute-query/create-dashboard`;
      console.log("API Endpoint:", endpoint);

      const data = await apiRequest("POST", endpoint, payload);
      console.log("Dashboard API Response:", data);

      if (!data.dashboard_id) {
        throw new Error("Dashboard ID missing in response");
      }

      const newDashboard = {
        id: data.dashboard_id,
        name: newDashboardName || `Dashboard ${dashboards.length + 1}`,
        isActive: true,
      };

      setDashboards((prevDashboards) => {
        const updatedDashboards = prevDashboards.map((dashboard) => ({
          ...dashboard,
          isActive: false,
        }));
        return [...updatedDashboards, newDashboard];
      });

      localStorage.setItem("current-dashboard-id", data.dashboard_id);
      setNewDashboardName("");

      fetchDashboardChartData(data.dashboard_id);
    } catch (error) {
      console.error("Failed to create dashboard:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchDashboard = async (id) => {
    try {
      const updatedDashboards = dashboards.map((dashboard) => ({
        ...dashboard,
        isActive: dashboard.id === id,
      }));
      setDashboards(updatedDashboards);

      fetchDashboardChartData(id);
    } catch (error) {
      console.error("Failed to switch dashboard:", error);
      setError(error.message || "Failed to switch dashboard");
    }
  };

  const handleDeleteDashboard = async (id) => {
    if (dashboards.length <= 1) return;

    try {
      await apiRequest(
        "DELETE",
        `${import.meta.env.VITE_BACKEND_URL}/execute-query/dashboards/${id}`
      );

      const filteredDashboards = dashboards.filter(
        (dashboard) => dashboard.id !== id
      );

      if (
        dashboards.find((d) => d.id === id)?.isActive &&
        filteredDashboards.length > 0
      ) {
        filteredDashboards[0].isActive = true;
        fetchDashboardChartData(filteredDashboards[0].id);
      }

      setDashboards(filteredDashboards);
    } catch (error) {
      console.error("Failed to delete dashboard:", error);
      setError(error.message || "Failed to delete dashboard");
    }
  };

  const activeDashboard = dashboards.find((d) => d.isActive) ||
    dashboards[0] || { name: "Dashboard" };

  useEffect(() => {
    if (activeDashboard && activeDashboard.id) {
      fetchDashboardChartData(activeDashboard.id);
    }
  }, [activeDashboard, fetchDashboardChartData]);

  const handleDateRangeApply = () => {
    if (activeDashboard && activeDashboard.id) {
      fetchDashboardChartData(activeDashboard.id, startDate, endDate);
    }
  };

  return (
    <div>
      <div className="flex gap-4 items-end mb-6 justify-center mt-4">
        <div>
          <Label>Start Date</Label>
          <input
            type="month"
            className="border p-2 rounded"
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <Label>End Date</Label>
          <input
            type="month"
            className="border p-2 rounded"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <Button onClick={handleDateRangeApply}>Apply Date Range</Button>
      </div>
      <div className="flex h-screen">
        <Button
          className="fixed top-20 left-0 z-10 p-2 bg-[#B4ADEA] rounded-r-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </Button>

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
            {isLoading && (
              <div className="text-center py-2">Loading dashboards...</div>
            )}
            {error && <div className="text-red-500 py-2">{error}</div>}

            <div className="space-y-2">
              {dashboards.map((dashboard) => (
                <div
                  key={dashboard.id}
                  className={`flex justify-between items-center p-2 rounded-md cursor-pointer ${
                    dashboard.isActive
                      ? "bg-blue-100 border-l-4 border-[#230C33]"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => handleSwitchDashboard(dashboard.id)}
                >
                  <span className="truncate">{dashboard.name}</span>
                  {dashboards.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDashboard(dashboard.id);
                      }}
                      className="opacity-70 hover:opacity-100"
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
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
                <Button
                  onClick={createOrGetDashboard}
                  size="sm"
                  disabled={loading}
                >
                  {loading ? "Creating..." : <PlusCircle size={16} />}
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

          {!dashboardQueries || dashboardQueries.length === 0 ? (
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
                  key={query.query_id}
                  className="relative overflow-hidden"
                  onMouseEnter={() => setHoveredCard(query.query_id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {hoveredCard === query.query_id && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 z-10"
                      onClick={() => removeFromDashboard(query.query_id)}
                    >
                      <X size={16} />
                    </Button>
                  )}
                  <CardHeader className="font-medium pb-2">
                    {query.query_text || "Visualization"}
                  </CardHeader>
                  <CardContent>
                    <DynamicChart
                      data={query.result}
                      chartType={query.chart_type?.toLowerCase() || "bar"}
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
