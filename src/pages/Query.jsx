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
import { Select } from "@/components/ui/select";

function Query() {
  const {
    fetchQueryTitles,
    executeQuery,
    queryResult,
    setSelectedQuery,
    addToDashboard,
    queries,
    loadMoreQueries,
    dashboards,
  } = useQueryStore();

  const [selectedQueries, setSelectedQueries] = useState(new Set());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const [dbEntryId, setDbEntryId] = useState(null);
  // const [dateRange, setDateRange] = useState({
  //   startDate: "",
  //   endDate: "",
  // });
  const navigate = useNavigate();
  const [selectedQuery, setSelectedQueryState] = useState(null);
  const [message, setMessage] = useState("");
  // const [response, setResponse] = useState("");
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

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
        //setIsErrorDialogOpen(true);
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
    setLoading(true);
    try {
      for (const queryId of selectedQueries) {
        const query = queries.queries_list.find((q) => q.id === queryId);
        if (query) {
          const result = await executeQuery(query.id);
          if (result) {
            addToDashboard({
              ...query,
              data: result.data,
              chartType: result.chartType,
            });
          }
        }
      }
      setSelectedQueries(new Set());
      navigate("/Dashboard");
    } catch (error) {
      console.error("Error adding queries to dashboard:", error);
      setError("Failed to add queries to dashboard");
      setIsErrorDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) {
      console.warn("handleSend: Message is empty, skipping request.");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        nl_query: message,
      };
      console.log("Sending request with payload:", payload);
      const res = await apiRequest(
        "POST",
        `${import.meta.env.VITE_BACKEND_URL}/external-db/nl-to-sql`,
        payload
      );
      console.log("handleSend: Response received from backend:", res);
      if (res && res.save_status && res.save_status.query_id) {
        const queryId = res.save_status.query_id;
        const tempQuery = {
          id: queryId,
          explanation: res.sql_query.explanation,
          chart_type: res.sql_query.chart_type,
          query: res.sql_query.sql_query,
        };
        setSelectedQueryState(tempQuery);
        setSelectedQuery(tempQuery);
        await executeQuery(queryId);
        setIsDialogOpen(true);
      } else {
        console.warn("No query ID received in response");
      }
    } catch (error) {
      console.error("handleSend: Error sending message:", error);
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="mt-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent animate-pulse">
          Loading queries...
        </p>
      </div>
    );
  }

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
      )}

      {selectedQueries.size > 0 && dashboards.length > 0 && (
        <div className="mt-4">
          <Button
            onClick={handleAddToDashboard}
            className="bg-green-500 text-white px-4 py-2 flex items-center space-x-2"
          >
            <span>Add to</span>
            <Select
              value={selectedDashboardId}
              onChange={(e) => setSelectedDashboardId(e.target.value)}
              className="bg-white text-black px-2 py-1 rounded-md"
            >
              {dashboards.map((dashboard) => (
                <option key={dashboard.id} value={dashboard.id}>
                  {dashboard.name}
                </option>
              ))}
            </Select>
          </Button>
        </div>
      )}

      <div className="mt-3 w-full max-w-md flex justify-center p-2 bg">
        <Button className="w-full bg-[#2D1242]" onClick={handleLoadMoreQueries}>
          Load more Queries
        </Button>
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
          <Button type="submit" className="bg-[#381952]" onClick={handleSend}>
            Execute
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
                    chartType={(queryResult.chartType || "line").toLowerCase()}
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
    </div>
  );
}

export default Query;
