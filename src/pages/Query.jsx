import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useQueryStore from "@/store/queryStore";

function Query() {
  const { queries, setSelectedQuery } = useQueryStore();

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
              <Link to="/Visualisation" className="w-full">
                <Button
                  className="w-full"
                  onClick={() => setSelectedQuery(query)}
                >
                  Execute
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-6 w-full max-w-md">
        <Button className="w-full">Load more Queries</Button>
      </div>
    </div>
  );
}

export default Query;
