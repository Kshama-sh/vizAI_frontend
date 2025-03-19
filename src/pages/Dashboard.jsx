import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, X, ChevronLeft, ChevronRight } from "lucide-react";
import useQueryStore from "@/store/queryStore";
import DynamicChart from "../components/static/DynamicChart";

function Dashboard() {
  const { dashboardQueries, removeFromDashboard } = useQueryStore();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboards, setDashboards] = useState([
    { id: 1, name: "Main Dashboard", isActive: true },
    { id: 2, name: "Dashboad 2", isActive: false },
  ]);
  const [newDashboardName, setNewDashboardName] = useState("");

  // Load dashboards from localStorage on component mount
  useEffect(() => {
    const savedDashboards = localStorage.getItem("dashboards");
    if (savedDashboards) {
      setDashboards(JSON.parse(savedDashboards));
    }
  }, []);

  // Save dashboards to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("dashboards", JSON.stringify(dashboards));
  }, [dashboards]);

  const handleCreateDashboard = () => {
    if (newDashboardName.trim()) {
      // Deactivate all current dashboards
      const updatedDashboards = dashboards.map((dashboard) => ({
        ...dashboard,
        isActive: false,
      }));

      // Add new dashboard as active
      const newDashboard = {
        id: Date.now(),
        name: newDashboardName.trim(),
        isActive: true,
      };

      setDashboards([...updatedDashboards, newDashboard]);
      setNewDashboardName("");
    }
  };

  const switchDashboard = (id) => {
    const updatedDashboards = dashboards.map((dashboard) => ({
      ...dashboard,
      isActive: dashboard.id === id,
    }));
    setDashboards(updatedDashboards);
  };

  const deleteDashboard = (id) => {
    if (dashboards.length <= 1) return;

    const filteredDashboards = dashboards.filter(
      (dashboard) => dashboard.id !== id
    );

    if (
      dashboards.find((d) => d.id === id)?.isActive &&
      filteredDashboards.length > 0
    ) {
      filteredDashboards[0].isActive = true;
    }

    setDashboards(filteredDashboards);
  };
  const activeDashboard = dashboards.find((d) => d.isActive) || dashboards[0];
  console.log("Dashboard Queries:", dashboardQueries);

  return (
    <div>
      <div className="flex gap-4 items-end mb-6 justify-center mt-4">
        <div>
          <Label>Start Date</Label>
          <input
            type="month"
            // value={dateRange.startDate}
            // onChange={(e) => handleDateRangeChange("startDate", e.target.value)}
            className="border p-2 rounded"
            placeholder="Start Date"
          />
        </div>
        <div>
          <Label>End Date</Label>
          <input
            type="month"
            // value={dateRange.endDate}
            // onChange={(e) => handleDateRangeChange("endDate", e.target.value)}
            className="border p-2 rounded"
            placeholder="End Date"
          />
        </div>
        <Button
        // onClick={applyDateRange}
        // disabled={!dateRange.startDate && !dateRange.endDate}
        >
          Apply Date Range
        </Button>
      </div>
      <div className="flex h-screen">
        <Button
          className="fixed top-20 left-0 z-10 p-2 bg-[#B4ADEA] rounded-r-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </Button>

        {/* Sidebar */}
        <div
          className={`w-64 bg-gray-100 p-4 transition-all duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed left-0 top-0 h-full z-20 shadow-lg`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Dashboards</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={18} />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Dashboard List */}
            <div className="space-y-2">
              {dashboards.map((dashboard) => (
                <div
                  key={dashboard.id}
                  className={`flex justify-between items-center p-2 rounded-md cursor-pointer ${
                    dashboard.isActive
                      ? "bg-blue-100 border-l-4 border-[#230C33]"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => switchDashboard(dashboard.id)}
                >
                  <span className="truncate">{dashboard.name}</span>
                  {dashboards.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDashboard(dashboard.id);
                      }}
                      className="opacity-70 hover:opacity-100"
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* add new dashboard */}
            <div className="pt-4 border-t">
              <Label htmlFor="dashboard-name">Create New Dashboard</Label>
              <div className="flex mt-2">
                <Input
                  id="dashboard-name"
                  value={newDashboardName}
                  onChange={(e) => setNewDashboardName(e.target.value)}
                  placeholder="Dashboard name"
                  className="mr-2"
                />
                <Button onClick={handleCreateDashboard} size="sm">
                  <PlusCircle size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`flex-1 p-6 transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              {activeDashboard?.name || "Dashboard"}
            </h1>
          </div>

          {dashboardQueries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500 mb-4">No visualizations added yet.</p>
              <Button onClick={() => (window.location.href = "/Query")}>
                Go to Query Page
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dashboardQueries.map((query) => (
                <Card
                  key={query.id}
                  className="relative overflow-hidden"
                  onMouseEnter={() => setHoveredCard(query.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {hoveredCard === query.id && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 z-10"
                      onClick={() => removeFromDashboard(query.id)}
                    >
                      <X size={16} />
                    </Button>
                  )}
                  <CardHeader className="font-medium pb-2">
                    {query.title || query.explanation || "Visualization"}
                  </CardHeader>
                  <CardContent>
                    <DynamicChart
                      data={query.data}
                      chartType={query.chartType}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

// import React, { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { PlusCircle, X, ChevronLeft, ChevronRight } from "lucide-react";
// import useQueryStore from "@/store/queryStore";
// import DynamicChart from "../components/static/DynamicChart";
// import axios from "axios"; // Make sure to install axios if not already done

// function Dashboard() {
//   const { dashboardQueries, removeFromDashboard } = useQueryStore();
//   const [hoveredCard, setHoveredCard] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [dashboards, setDashboards] = useState([]);
//   const [newDashboardName, setNewDashboardName] = useState("");
//   const [isLoading, setIsLoading] = useState(true);

//   // API URLs - Replace with your actual backend URLs
//   const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

//   // Fetch all dashboards for the user when component mounts
//   useEffect(() => {
//     fetchUserDashboards();
//   }, []);

//   // Function to fetch all dashboards for logged-in user
//   const fetchUserDashboards = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(`${API_URL}/dashboards`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token-based auth
//         },
//       });

//       if (response.data && response.data.dashboards) {
//         // Transform backend data format to match your frontend format
//         const fetchedDashboards = response.data.dashboards.map((dashboard) => ({
//           id: dashboard.id,
//           name: dashboard.name,
//           isActive: false, // Set first one active after mapping
//         }));

//         // If dashboards exist, set first one as active
//         if (fetchedDashboards.length > 0) {
//           fetchedDashboards[0].isActive = true;

//           // Fetch charts for the active dashboard
//           fetchChartsForDashboard(fetchedDashboards[0].id);
//         } else {
//           // No dashboards exist, create a default one
//           createDefaultDashboard();
//         }

//         setDashboards(fetchedDashboards);
//       } else {
//         // In case of empty response, create default dashboard
//         createDefaultDashboard();
//       }
//     } catch (error) {
//       console.error("Failed to fetch dashboards:", error);
//       // On error, create a default dashboard
//       createDefaultDashboard();
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Create a default dashboard if none exists
//   const createDefaultDashboard = async () => {
//     try {
//       const response = await axios.post(
//         `${API_URL}/dashboards`,
//         {
//           name: "Main Dashboard",
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       if (response.data && response.data.dashboard_id) {
//         const defaultDashboard = {
//           id: response.data.dashboard_id,
//           name: "Main Dashboard",
//           isActive: true,
//         };

//         setDashboards([defaultDashboard]);
//       }
//     } catch (error) {
//       console.error("Failed to create default dashboard:", error);
//       // In case of API failure, create a local fallback
//       setDashboards([
//         {
//           id: Date.now(), // Temporary ID
//           name: "Main Dashboard",
//           isActive: true,
//         },
//       ]);
//     }
//   };

//   // Create a new dashboard
//   const handleCreateDashboard = async () => {
//     if (newDashboardName.trim()) {
//       try {
//         const response = await axios.post(
//           `${API_URL}/dashboards`,
//           {
//             name: newDashboardName.trim(),
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );

//         if (response.data && response.data.dashboard_id) {
//           const updatedDashboards = dashboards.map((dashboard) => ({
//             ...dashboard,
//             isActive: false,
//           }));

//           const newDashboard = {
//             id: response.data.dashboard_id,
//             name: newDashboardName.trim(),
//             isActive: true,
//           };

//           setDashboards([...updatedDashboards, newDashboard]);
//           setNewDashboardName("");

//           useQueryStore.setState({ dashboardQueries: [] });
//         }
//       } catch (error) {
//         console.error("Failed to create dashboard:", error);
//         // Handle error appropriately
//       }
//     }
//   };

//   // Switch dashboard and fetch associated charts
//   const switchDashboard = async (id) => {
//     // First update UI for better user experience
//     const updatedDashboards = dashboards.map((dashboard) => ({
//       ...dashboard,
//       isActive: dashboard.id === id,
//     }));
//     setDashboards(updatedDashboards);

//     // Fetch charts for this dashboard
//     fetchChartsForDashboard(id);
//   };

//   // Fetch charts for a specific dashboard
//   const fetchChartsForDashboard = async (dashboardId) => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(
//         `${API_URL}/dashboards/${dashboardId}/charts`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       if (response.data && response.data.charts) {
//         // Update the queryStore with charts from this dashboard
//         useQueryStore.setState({ dashboardQueries: response.data.charts });
//       }
//     } catch (error) {
//       console.error(
//         `Failed to fetch charts for dashboard ${dashboardId}:`,
//         error
//       );
//       // Handle error appropriately
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Delete dashboard from backend and state
//   const deleteDashboard = async (id) => {
//     if (dashboards.length <= 1) return; // Prevent deleting the last dashboard

//     try {
//       await axios.delete(`${API_URL}/dashboards/${id}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       // Remove from state after successful deletion
//       const filteredDashboards = dashboards.filter(
//         (dashboard) => dashboard.id !== id
//       );

//       // If we deleted the active dashboard, activate another one
//       if (
//         dashboards.find((d) => d.id === id)?.isActive &&
//         filteredDashboards.length > 0
//       ) {
//         filteredDashboards[0].isActive = true;

//         // Fetch charts for newly activated dashboard
//         fetchChartsForDashboard(filteredDashboards[0].id);
//       }

//       setDashboards(filteredDashboards);
//     } catch (error) {
//       console.error(`Failed to delete dashboard ${id}:`, error);
//       // Handle error appropriately
//     }
//   };

//   // Remove chart from dashboard (both backend and frontend)
//   const handleRemoveFromDashboard = async (chartId) => {
//     const activeDashboard = dashboards.find((d) => d.isActive);
//     if (!activeDashboard) return;

//     try {
//       await axios.delete(
//         `${API_URL}/dashboards/${activeDashboard.id}/charts/${chartId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       // If successful, update frontend state
//       removeFromDashboard(chartId);
//     } catch (error) {
//       console.error(`Failed to remove chart ${chartId} from dashboard:`, error);
//       // Handle error appropriately
//     }
//   };

//   const activeDashboard = dashboards.find((d) => d.isActive) || dashboards[0];

//   return (
//     <div>
//       <div className="flex gap-4 items-end mb-6 justify-center mt-4">
//         <div>
//           <Label>Start Date</Label>
//           <input
//             type="month"
//             className="border p-2 rounded"
//             placeholder="Start Date"
//           />
//         </div>
//         <div>
//           <Label>End Date</Label>
//           <input
//             type="month"
//             className="border p-2 rounded"
//             placeholder="End Date"
//           />
//         </div>
//         <Button>Apply Date Range</Button>
//       </div>

//       <div className="flex h-screen">
//         <Button
//           className="fixed top-20 left-0 z-10 p-2 bg-[#B4ADEA] rounded-r-md"
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//         >
//           {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
//         </Button>

//         {/* Sidebar */}
//         <div
//           className={`w-64 bg-gray-100 p-4 transition-all duration-300 ${
//             sidebarOpen ? "translate-x-0" : "-translate-x-full"
//           } fixed left-0 top-0 h-full z-20 shadow-lg`}
//         >
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-bold">Dashboards</h2>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setSidebarOpen(false)}
//             >
//               <X size={18} />
//             </Button>
//           </div>

//           <div className="space-y-4">
//             {/* Dashboard List */}
//             <div className="space-y-2">
//               {isLoading ? (
//                 <div className="text-center p-4">Loading dashboards...</div>
//               ) : (
//                 dashboards.map((dashboard) => (
//                   <div
//                     key={dashboard.id}
//                     className={`flex justify-between items-center p-2 rounded-md cursor-pointer ${
//                       dashboard.isActive
//                         ? "bg-blue-100 border-l-4 border-[#230C33]"
//                         : "hover:bg-gray-200"
//                     }`}
//                     onClick={() => switchDashboard(dashboard.id)}
//                   >
//                     <span className="truncate">{dashboard.name}</span>
//                     {dashboards.length > 1 && (
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           deleteDashboard(dashboard.id);
//                         }}
//                         className="opacity-70 hover:opacity-100"
//                       >
//                         <X size={16} />
//                       </Button>
//                     )}
//                   </div>
//                 ))
//               )}
//             </div>

//             {/* Create New Dashboard */}
//             <div className="pt-4 border-t">
//               <Label htmlFor="dashboard-name">Create New Dashboard</Label>
//               <div className="flex mt-2">
//                 <Input
//                   id="dashboard-name"
//                   value={newDashboardName}
//                   onChange={(e) => setNewDashboardName(e.target.value)}
//                   placeholder="Dashboard name"
//                   className="mr-2"
//                 />
//                 <Button onClick={handleCreateDashboard} size="sm">
//                   <PlusCircle size={16} />
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div
//           className={`flex-1 p-6 transition-all duration-300 ${
//             sidebarOpen ? "ml-64" : "ml-0"
//           }`}
//         >
//           <div className="mb-6">
//             <h1 className="text-2xl font-bold">
//               {activeDashboard?.name || "Dashboard"}
//             </h1>
//           </div>

//           {isLoading ? (
//             <div className="flex items-center justify-center h-64">
//               <p>Loading charts...</p>
//             </div>
//           ) : dashboardQueries.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
//               <p className="text-gray-500 mb-4">No visualizations added yet.</p>
//               <Button onClick={() => (window.location.href = "/Query")}>
//                 Go to Query Page
//               </Button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {dashboardQueries.map((query) => (
//                 <Card
//                   key={query.id}
//                   className="relative overflow-hidden"
//                   onMouseEnter={() => setHoveredCard(query.id)}
//                   onMouseLeave={() => setHoveredCard(null)}
//                 >
//                   {hoveredCard === query.id && (
//                     <Button
//                       variant="destructive"
//                       size="sm"
//                       className="absolute top-2 right-2 z-10"
//                       onClick={() => handleRemoveFromDashboard(query.id)}
//                     >
//                       <X size={16} />
//                     </Button>
//                   )}
//                   <CardHeader className="font-medium pb-2">
//                     {query.title || query.explanation || "Visualization"}
//                   </CardHeader>
//                   <CardContent>
//                     <DynamicChart
//                       data={query.data}
//                       chartType={query.chartType}
//                     />
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;
