import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
function Query() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <Card key={index} className="p-4 shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-center">
                Query
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 text-center">
              Sample query
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link to="/Visualisation">
                <Button className="w-full">Execute</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div>
        <div className="mt-8 flex justify-center">
          <Button className="w-1/2 md:w-1/3 lg:w-1/4">
            Generate More Queries
          </Button>
        </div>
      </div>
    </div>
  );
}
export default Query;
