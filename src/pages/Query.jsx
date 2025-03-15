import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useQueryStore from "@/store/queryStore";
import DynamicChart from "../components/static/DynamicChart";
import { Label } from "@radix-ui/react-dropdown-menu";

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
    <div className="p-6 flex flex-col items-center justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
        {queries.map((query) => (
          <Card
            key={query.id}
            className="flex flex-col justify-between h-auto p-4 hover:shadow-xl"
          >
            <CardContent className="text-gray-700 text-center flex items-center">
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
      <div className="mt-6 w-full max-w-md">
        <Button className="w-full">Load more Queries</Button>
      </div>
      <div>
        <Label>Chat here</Label>
        <input type="text" placeholder="enter your text here"></input>
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
              <p className="text-gray-600 text-sm ">
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
