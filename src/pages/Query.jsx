import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import useQueryStore from "@/store/queryStore";

function Query() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setSelectedQuery } = useQueryStore();

  useEffect(() => {
    const dummyQueries = [
      {
        id: 1,
        title:
          "What is the trend of total salary expenditure over the past year?",
        relevance: 0.9,
      },
      {
        id: 2,
        title:
          "What is the average salary by department over the specified time period?",
        relevance: 0.8,
      },
      {
        id: 3,
        title:
          "What is the quarterly total salary expenditure trend over the last 2 years?",
        relevance: 0.8,
      },
      {
        id: 4,
        title:
          "What is the year-over-year change in average salary for each job title?",
        relevance: 0.7,
      },
      {
        id: 5,
        title:
          "How does the monthly salary expenditure change within each department?",
        relevance: 0.7,
      },
      {
        id: 6,
        title:
          "What is the distribution of salaries across different departments?",
        relevance: 0.9,
      },
      {
        id: 7,
        title: "What is the salary range for each job title?",
        relevance: 0.8,
      },
      {
        id: 8,
        title: "What is the employee headcount by department?",
        relevance: 0.7,
      },
      {
        id: 9,
        title: "What is the ratio of minimum to maximum salary for each job?",
        relevance: 0.6,
      },
      {
        id: 10,
        title:
          "How does the average salary correlate with the job's minimum salary?",
        relevance: 0.6,
      },
    ];

    setTimeout(() => {
      setQueries([...dummyQueries].sort((a, b) => b.relevance - a.relevance));
      setLoading(false);
    }, 500);
  }, []);

  if (loading)
    return <div className="flex justify-center p-6">Loading queries...</div>;
  if (error) return <div className="text-red-500 text-center p-6">{error}</div>;

  return (
    <div className="p-6">
      <div className="p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
        {queries.map((query, index) => (
          <Card
            key={query.id || index}
            className="p-4 shadow-lg rounded-lg hover:shadow-2xl flex flex-col justify-between h-48"
          >
            <CardContent className="text-gray-600 text-center flex-grow min-h-24 flex items-center justify-center">
              {query.title}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                className="w-full px-5 py-2"
                onClick={() => setSelectedQuery(query)}
                asChild
              >
                <Link to="/Visualisation">Execute</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Button className="w-1/2 md:w-1/3 lg:w-1/4 px-6 py-3">
          Generate More Queries
        </Button>
      </div>
    </div>
  );
}

export default Query;
