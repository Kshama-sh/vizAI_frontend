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
function Query() {
  const {
    fetchQueryTitles,
    executeQuery,
    queryResult,
    setSelectedQuery,
    addToDashboard,
    queries,
  } = useQueryStore();

  const [selectedQueries, setSelectedQueries] = useState(new Set());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
          await fetchQueryTitles(parseInt(savedDbEntryId));
        } else if (queries.length === 0) {
          console.log(" No saved dbEntryId found, using fallback ID: 34");
          await fetchQueryTitles(34);
        } else {
          console.log(" Queries already loaded in store:", queries.length);
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

  const handlePreview = (query) => {
    console.log("🔍 Previewing Query:", query);
    setSelectedQuery(query);
    executeQuery(query.id);
    setIsDialogOpen(true);
  };

  const handleAddToDashboard = () => {
    selectedQueries.forEach((queryId) => {
      const query = queries.find((q) => q.id === queryId);
      if (query) {
        addToDashboard(query);
      }
    });
    setSelectedQueries(new Set());
    navigate("/Dashboard");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="mt-4 text-gray-500">Loading queries...</p>
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
      {queries.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">
            No queries found. Check API response or database connection.
          </p>
          <Button onClick={() => (window.location.href = "/Database")}>
            Setup Database Connection
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
          {queries.map((query) => (
            <Card
              key={query.id}
              className="flex flex-col justify-between p-4 border hover:shadow-xl"
            >
              <CardHeader className="flex flex-row justify-end">
                <Checkbox
                  className="border-gray-400"
                  checked={selectedQueries.has(query.id)}
                  onCheckedChange={() => handleCheckboxChange(query.id)}
                />
              </CardHeader>
              <CardContent className="text-gray-600 text-sm">
                {query.explanation || "No title available"}
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handlePreview(query)}>
                  Preview
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <div className="mt-3 w-full max-w-md flex justify-center p-2">
        <Button className="w-full">Load more Queries</Button>
      </div>
      {selectedQueries.size > 0 && (
        <div className="mt-4">
          <Button
            onClick={handleAddToDashboard}
            className="bg-green-500 text-white px-4 py-2"
          >
            Add to Dashboard
          </Button>
        </div>
      )}
      <div className="mt-3 flex flex-col space-x-3 w-full p-4 rounded-2xl shadow-lg border gap-0.5">
        <Label htmlFor="chat" className="font-bold text-gray-400">
          Chat
        </Label>
        <div className="flex gap-2">
          <Input
            id="chat"
            type="text"
            placeholder="Ask anything"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit">Send</Button>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Query Preview</DialogTitle>
          </DialogHeader>
          {queryResult ? (
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
              {JSON.stringify(queryResult, null, 2)}
            </pre>
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

{
  /* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl p-6">
          <DialogHeader>
            <DialogTitle>{selectedQuery?.title || "Query Preview"}</DialogTitle>
          </DialogHeader>

          {queryResult?.data ? (
            <div className="flex flex-col items-center gap-4">
              <DynamicChart
                data={queryResult.data}
                chartType={queryResult.chartType}
              />
              <p className="text-gray-600 text-sm text-center">
                <span className="font-bold">Report Summary:</span>
                {queryResult.report || "No summary available"}
              </p>
            </div>
          ) : (
            <p className="text-center text-gray-500">Fetching results...</p>
          )}
        </DialogContent>
      </Dialog> */
}
