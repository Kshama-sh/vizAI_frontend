import React, { useState } from "react";
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
import DynamicChart from "../components/static/DynamicChart";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
function Query() {
  const { queries, setSelectedQuery, executeQuery, queryResult } =
    useQueryStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePreview = (query) => {
    setSelectedQuery(query);
    executeQuery(query.id);
    setIsDialogOpen(true);
  };

  const selectedQuery = useQueryStore((state) => state.selectedQuery);

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
        {queries.map((query) => (
          <Card
            key={query.id}
            className="flex flex-col justify-between p-4 border hover:shadow-xl"
          >
            <CardHeader className="flex flex-row justify-end">
              <Checkbox className="border-gray-400" />
            </CardHeader>
            <CardContent className="text-gray-700 text-center items-center">
              {query.title}
            </CardContent>
            <CardFooter className="mt-auto">
              <Button className="w-full" onClick={() => handlePreview(query)}>
                Preview
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-3 w-full max-w-md flex justify-center p-2">
        <Button className="w-full">Load more Queries</Button>
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
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit">Send</Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
      </Dialog>
    </div>
  );
}
export default Query;
