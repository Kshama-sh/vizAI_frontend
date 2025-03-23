import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, X, ChevronLeft, Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DynamicChart from "./DynamicChart";
import useQueryStore from "@/store/queryStore";
import getChartThumbnail from "@/utils/chartThumbnails";

const RightsideBar = ({ activeDashboardId }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [selectedDashboardId, setSelectedDashboardId] = useState("");
  const [addingToDashboard, setAddingToDashboard] = useState(false);
  const [error, setError] = useState("");
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

  const {
    fetchQueryTitles,
    executeQuery,
    queryResult,
    queries,
    dashboards,
    addQueriesToDashboard,
    fetchDashboardChartData,
  } = useQueryStore();

  useEffect(() => {
    if (sidebarOpen) {
      loadQueries();
    }
  }, [sidebarOpen]);

  useEffect(() => {
    if (activeDashboardId) {
      setSelectedDashboardId(activeDashboardId);
    } else if (dashboards.length > 0) {
      setSelectedDashboardId(dashboards[0].id);
    }
  }, [activeDashboardId, dashboards]);

  const loadQueries = async () => {
    try {
      setLoading(true);
      const savedDbEntryId = localStorage.getItem("current-db-entry-id");
      if (savedDbEntryId) {
        await fetchQueryTitles(savedDbEntryId);
      } else {
        setError(
          "No database connection found. Please setup your database first."
        );
      }
    } catch (err) {
      console.error("Error loading queries:", err);
      setError(
        "Failed to load queries. Please try reconnecting your database."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (query) => {
    setSelectedQuery(query);
    try {
      await executeQuery(query.id);
      setIsPreviewDialogOpen(true);
    } catch (error) {
      console.error("Error previewing query:", error);
      setError("Failed to load query preview");
      setIsErrorDialogOpen(true);
    }
  };

  const handleAddToDashboard = (query) => {
    setSelectedQuery(query);
    setIsAddDialogOpen(true);
  };

  const confirmAddToDashboard = async () => {
    if (!selectedDashboardId) {
      setError("Please select a dashboard first");
      setIsErrorDialogOpen(true);
      return;
    }

    setAddingToDashboard(true);
    try {
      await addQueriesToDashboard(selectedDashboardId, [selectedQuery.id]);
      setIsAddDialogOpen(false);
      if (selectedDashboardId === activeDashboardId) {
        await fetchDashboardChartData(activeDashboardId);
      }
    } catch (error) {
      console.error("Error adding query to dashboard:", error);
      setError(error.message || "Failed to add query to dashboard");
      setIsErrorDialogOpen(true);
    } finally {
      setAddingToDashboard(false);
    }
  };

  return (
    <>
      <Button
        className="fixed top-20 right-0 z-10 p-2 bg-[#B4ADEA] rounded-l-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </Button>

      <div
        className={`w-64 bg-gray-100 p-4 transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } fixed right-0 top-0 h-full z-20 shadow-lg overflow-y-auto`}
      >
        <div className="mb-6 flex">
          <h2 className="text-xl font-bold">
            Click to preview or add to dashboard
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-24">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading queries...</span>
          </div>
        ) : error && !queries?.queries_list?.length ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg">
            <p className="text-sm">{error}</p>
            <Button
              variant="link"
              className="text-red-700 p-0 mt-1 text-sm"
              onClick={() => (window.location.href = "/Database")}
            >
              Setup Database
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {queries?.queries_list?.length > 0 ? (
              queries.queries_list.map((query) => (
                <Card key={query.id} className="border shadow-sm bg-white">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 mr-2">
                        <p className="text-sm font-medium line-clamp-2">
                          {query.explanation || "No title available"}
                        </p>
                        <div className="mt-2 w-full h-12 rounded overflow-hidden">
                          <img
                            src={getChartThumbnail(query.chart_type)}
                            alt={`${query.chart_type} preview`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto"
                        onClick={() => handleAddToDashboard(query)}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="p-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => handlePreview(query)}
                    >
                      Preview
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-500">No queries available</p>
            )}
          </div>
        )}
      </div>
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedQuery?.explanation || "Query Preview"}
            </DialogTitle>
          </DialogHeader>
          {queryResult ? (
            <div className="p-4">
              {Array.isArray(queryResult.data) &&
              queryResult.data.length > 0 ? (
                <div className="h-80">
                  <DynamicChart
                    data={queryResult.data}
                    chartType={queryResult.chartType}
                    xAxisLabel={queryResult.x_axis}
                    yAxisLabel={queryResult.y_axis}
                  />
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  No valid chart data available.
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <p>Loading query results...</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Dashboard</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Select
              value={selectedDashboardId}
              onValueChange={setSelectedDashboardId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Dashboard" />
              </SelectTrigger>
              <SelectContent>
                {dashboards.map((dashboard) => (
                  <SelectItem key={dashboard.id} value={dashboard.id}>
                    {dashboard.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmAddToDashboard}
              disabled={addingToDashboard}
            >
              {addingToDashboard ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add to Dashboard"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <p>{error}</p>
          <div className="flex justify-end">
            <Button onClick={() => setIsErrorDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RightsideBar;
