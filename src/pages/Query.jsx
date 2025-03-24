import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useQueryStore from "@/store/queryStore";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import DynamicChart from "@/components/static/DynamicChart";
import { apiRequest } from "../api/access_token";
import getChartThumbnail from "../utils/chartThumbnails";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Query() {
  const {
    fetchQueryTitles,
    executeQuery,
    queryResult,
    setSelectedQuery,
    queries,
    loadMoreQueries,
    dashboards,
    addQueriesToDashboard,
    fetchUserDashboards,
  } = useQueryStore();

  const [selectedQueries, setSelectedQueries] = useState(new Set());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadCount, setLoadCount] = useState(0);
  const navigate = useNavigate();
  const [query, setQueries] = useState(["Query 1", "Query 2", "Query 3"]);
  const [selectedQuery, setSelectedQueryState] = useState(null);
  const [message, setMessage] = useState("");
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedDashboardId, setSelectedDashboardId] = useState("");
  const [addingToDashboard, setAddingToDashboard] = useState(false);

  useEffect(() => {
    fetchUserDashboards();
  }, []);

  useEffect(() => {
    if (dashboards.length > 0 && !selectedDashboardId) {
      setSelectedDashboardId(dashboards[0].id);
    }
  }, [dashboards]);

  useEffect(() => {
    const loadQueries = async () => {
      try {
        setLoading(true);
        const savedDbEntryId = localStorage.getItem("current-db-entry-id");
        if (savedDbEntryId) {
          console.log(
            " Using saved dbEntryId from localStorage:",
            savedDbEntryId
          );
          await fetchQueryTitles(savedDbEntryId);
        } else if (queries.queries_list.length === 0) {
          console.log(" No saved dbEntryId found, using fallback ID: 34");
        } else {
          console.log(
            " Queries already loaded in store:",
            queries.queries_list.length
          );
        }
      } catch (err) {
        console.error(" Error loading queries:", err);
        setError(
          "Failed to load queries. Please try reconnecting your database."
        );
      } finally {
        setLoading(false);
      }
    };
    loadQueries();
  }, [fetchQueryTitles]);

  const handleLoadMoreQueries = async () => {
    const savedDbEntryId = localStorage.getItem("current-db-entry-id");
    try {
      if (!savedDbEntryId) {
        setError(
          "Database entry ID is missing. Please verify your database first."
        );
        return;
      }
      console.log(savedDbEntryId);
      await loadMoreQueries(savedDbEntryId);
    } catch (error) {
      console.error("Error loading more queries:", error);
      setError("Failed to load more queries.");
      setIsErrorDialogOpen(true);
    }
  };

  const handleCheckboxChange = (queryId) => {
    setSelectedQueries((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(queryId)) {
        newSelected.delete(queryId);
      } else {
        newSelected.add(queryId);
      }
      return newSelected;
    });
  };

  const handlePreview = async (query) => {
    console.log("Previewing Query:", query);
    setSelectedQueryState(query);
    setSelectedQuery(query);
    try {
      await executeQuery(query.id);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error previewing query:", error);
    }
  };

  const handleAddToDashboard = async () => {
    if (!selectedDashboardId) {
      setError("Please select a dashboard first.");
      setIsErrorDialogOpen(true);
      return;
    }

    if (selectedQueries.size === 0) {
      setError("Please select at least one query to add to dashboard.");
      setIsErrorDialogOpen(true);
      return;
    }

    setAddingToDashboard(true);
    try {
      const queryIdsArray = Array.from(selectedQueries);
      await addQueriesToDashboard(selectedDashboardId, queryIdsArray);
      setSelectedQueries(new Set());
      navigate("/Dashboard");
    } catch (error) {
      console.error("Error adding queries to dashboard:", error);
      setError(error.message || "Failed to add queries to dashboard");
      setIsErrorDialogOpen(true);
    } finally {
      setAddingToDashboard(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) {
      console.warn("handleSend: Message is empty, skipping request.");
      return;
    }
    try {
      setLoading(true);
      const payload = { nl_query: message };
      console.log("Sending request with payload:", payload);
      const res = await apiRequest(
        "POST",
        `${import.meta.env.VITE_BACKEND_URL}/external-db/nl-to-sql`,
        payload
      );
      if (
        !res ||
        !res.save_status ||
        !res.save_status.query_id ||
        !res.sql_query
      ) {
        console.warn("Invalid response received from backend:", res);
        return;
      }
      console.log("handleSend: Response received from backend:", res);
      const queryId = res.save_status.query_id;
      const tempQuery = {
        id: queryId,
        explanation: res.sql_query.explanation || "No explanation provided",
        chart_type: res.sql_query.chart_type || "bar",
        query_text: res.sql_query.sql_query || "",
        isNlQuery: true,
        originalQuestion: message,
      };
      useQueryStore.setState((state) => ({
        ...state,
        queries: {
          ...state.queries,
          user_generated: state.queries.user_generated
            ? [...state.queries.user_generated, tempQuery]
            : [tempQuery],
        },
      }));

      setSelectedQueryState(tempQuery);
      setSelectedQuery(tempQuery);
      await executeQuery(queryId);
      const savedDbEntryId = localStorage.getItem("current-db-entry-id");
      if (savedDbEntryId) {
        await fetchQueryTitles(savedDbEntryId);
      }
      setIsDialogOpen(true);
    } catch (error) {
      console.error("handleSend: Error sending message:", error);
      setError("Failed to process your query. Please try again.");
      setIsErrorDialogOpen(true);
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p>{error}</p>
        </div>
        <Button onClick={() => (window.location.href = "/Database")}>
          Return to Database Setup
        </Button>
      </div>
    );
  }

  const loadMoreQuery = () => {
    if (loadCount >= 2) {
      setShowDialog(true);
      return;
    }
    setQueries([
      ...query,
      `Query ${query.length + 1}`,
      `Query ${query.length + 2}`,
    ]);
    setLoadCount(loadCount + 1);
  };

  return (
    <div className="p-6 flex flex-col items-center">
      {queries.queries_list.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-300 mb-4">
            No queries found. Check database connection.
          </p>
          <Button onClick={() => (window.location.href = "/Database")}>
            Setup Database Connection
          </Button>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
            {queries.queries_list.map((query) => (
              <Card
                key={query.id}
                className="flex flex-col justify-between p-4 border hover:shadow-xl bg-[#381952]"
              >
                <CardHeader className="flex flex-row justify-end">
                  <Checkbox
                    className="border-gray-400"
                    checked={selectedQueries.has(query.id)}
                    onCheckedChange={() => handleCheckboxChange(query.id)}
                  />
                </CardHeader>
                <CardContent className="text-white text-sm">
                  {query.explanation || "No title available"}
                  <div className="w-full h-15 rounded-lg overflow-hidden">
                    <img
                      src={getChartThumbnail(query.chart_type)}
                      alt={`${query.chart_type} preview`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-[#C4BEEE]"
                    onClick={() => handlePreview(query)}
                  >
                    Preview
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
            {queries.user_generated &&
              queries.user_generated.map((query) => (
                <div>
                  <h1 className="text-2xl font-bold p-3">
                    Your custom queries
                  </h1>
                  <Card
                    key={query.id}
                    className="flex flex-col justify-between p-4 border hover:shadow-xl bg-[#9976b5]"
                  >
                    <CardHeader className="flex flex-row justify-end">
                      <Checkbox
                        className="border-gray-400"
                        checked={selectedQueries.has(query.id)}
                        onCheckedChange={() => handleCheckboxChange(query.id)}
                      />
                    </CardHeader>
                    <CardContent className="text-white text-sm">
                      <p className="text-gray-300 text-sm">
                        {query.explanation}
                      </p>
                      <div className="w-full h-15 rounded-lg overflow-hidden mt-2">
                        <img
                          src={getChartThumbnail(query.chart_type)}
                          alt={`${query.chart_type} preview`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full bg-[#D4CEEE]"
                        onClick={() => handlePreview(query)}
                      >
                        Preview
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ))}
          </div>
        </div>
      )}
      {selectedQueries.size > 0 && (
        <div className="mt-4 flex items-center gap-2">
          {dashboards.length > 0 ? (
            <>
              <Select
                value={selectedDashboardId}
                onValueChange={setSelectedDashboardId}
              >
                <SelectTrigger className="w-48 bg-white text-black">
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
              <Button
                onClick={handleAddToDashboard}
                className="bg-green-500 text-white"
                disabled={addingToDashboard || !selectedDashboardId}
              >
                {addingToDashboard ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  `Add to Dashboard`
                )}
              </Button>
            </>
          ) : (
            <div className="text-yellow-500">
              No dashboards available. Please create a dashboard first.
            </div>
          )}
        </div>
      )}
      <div className="mt-3 w-full max-w-md flex justify-center p-2 bg">
        <Button
          className="w-full bg-[#2D1242]"
          onClick={() => {
            handleLoadMoreQueries();
            loadMoreQuery();
          }}
        >
          Load more Queries
        </Button>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>No More Queries</DialogTitle>
            </DialogHeader>
            <p>
              You have reached the maximum number of queries that can be loaded.
            </p>
            <Button onClick={() => setShowDialog(false)}>OK</Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-3 flex flex-col space-x-3 w-full p-4 rounded-2xl shadow-lg border gap-0.5">
        <Label htmlFor="chat" className="font-bold text-gray-400">
          Chat
        </Label>
        <div className="flex gap-2">
          <Input
            id="chat"
            type="text"
            placeholder="Ask anything"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <Button
            type="submit"
            className="bg-[#381952]"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Execute"
            )}
          </Button>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl ">
          <DialogHeader>
            <DialogTitle>
              {selectedQuery?.explanation || "Query Preview"}
            </DialogTitle>
          </DialogHeader>
          {queryResult ? (
            <div className="p-4">
              {Array.isArray(queryResult.data) &&
              queryResult.data.length > 0 ? (
                <div className="h-100">
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
      <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <p>{error}</p>
          <Button onClick={() => setIsErrorDialogOpen(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default Query;
