import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import useQueryStore from "@/store/queryStore";
import DynamicChart from "../components/static/DynamicChart";
// import { Navigate, useNavigate } from "react-router-dom";
function Dashboard() {
  const { dashboardQueries, removeFromDashboard } = useQueryStore();
  const [hoveredCard, setHoveredCard] = useState(null);
  // const navigate = useNavigate();

  return (
    <div className="p-6">
      {dashboardQueries.length === 0 ? (
        <p className="text-gray-500 text-center">
          No visualizations added yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {dashboardQueries.map((query) => (
            <Card
              key={query.id}
              className="p-4 border rounded-2xl hover:shadow-2xl relative transition-all duration-300"
              onMouseEnter={() => setHoveredCard(query.id)}
              onMouseLeave={() => setHoveredCard(null)}
              // onClick={() => navigate("/Visualization")}
            >
              {hoveredCard === query.id && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 bg-white/70 hover:bg-white shadow-md rounded-full p-2"
                  onClick={() => removeFromDashboard(query.id)}
                >
                  <X className="h-5 w-5 text-gray-500 hover:text-red-500 transition-all" />
                </Button>
              )}

              <CardHeader className="text-xs font-semibold text-center">
                {query.title}
              </CardHeader>
              <CardContent>
                <DynamicChart data={query.data} chartType={query.chartType} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;

// import React from "react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import useQueryStore from "@/store/queryStore";
// import Sidebar from "@/components/static/Sidebar";
// import DynamicChart from "../components/static/DynamicChart";
// import { Button } from "@/components/ui/button";
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

// function Dashboard() {
//   const { dashboards, activeDashboard, removeFromDashboard } = useQueryStore();
//   const dashboard = dashboards[activeDashboard];

//   return (
//     <div className="flex">
//       {/* <SidebarProvider>
//         <Sidebar />
//         <SidebarTrigger />
//       </SidebarProvider> */}
//       <div className="p-6 w-full">
//         <h2 className="text-2xl font-bold mb-4">
//           {dashboard?.name || "Dashboard"}
//         </h2>
//         {dashboard?.queries.length === 0 ? (
//           <p className="text-gray-500">No visualizations added yet.</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {dashboard.queries.map((query) => (
//               <Card
//                 key={query.id}
//                 className="p-4 border rounded-2xl hover:shadow-2xl relative transition-all duration-300"
//               >
//                 <CardHeader className="text-lg font-semibold">
//                   {query.title}
//                 </CardHeader>
//                 <CardContent>
//                   <DynamicChart data={query.data} chartType={query.chartType} />
//                 </CardContent>
//                 <Button
//                   className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md opacity-0 hover:opacity-100 transition-opacity"
//                   onClick={() => removeFromDashboard(query.id)}
//                 >
//                   ✕
//                 </Button>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Dashboard;
