import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiRequest } from "@/api/access_token";

const useQueryStore = create(
  persist(
    (set, get) => ({
      queries: [],
      selectedQuery: null,
      queryResult: null,
      dashboardQueries: [],
      dashboards: [],
      activeDashboardId: null,
      isLoadingDashboards: false,
      dashboardError: null,
      isLoadingQueries: false,
      hasMore: true,
      isUpdatingQueries: false,

      fetchUserDashboards: async () => {
        set({ isLoadingDashboards: true, dashboardError: null });
        try {
          const roleId = localStorage.getItem("user-role");
          if (!roleId)
            throw new Error("Role ID is required to fetch dashboards.");

          const response = await apiRequest(
            "GET",
            `${import.meta.env.VITE_BACKEND_URL}/execute-query/dashboards`,
            null,
            { role_id: roleId }
          );
          const formattedDashboards = Array.isArray(response)
            ? response.map((dashboard) => ({
                id: dashboard.id,
                name: dashboard.name,
                isActive: false,
              }))
            : [{ id: "default", name: "Main Dashboard", isActive: true }];
          formattedDashboards[0].isActive = true;
          set({ dashboards: formattedDashboards });
        } catch (error) {
          console.error("Failed to fetch dashboards:", error);
          set({
            dashboardError: error.message || "Failed to fetch dashboards",
          });
        } finally {
          set({ isLoadingDashboards: false });
        }
      },

      fetchQueryTitles: async (dbEntryId) => {
        console.log(" Fetching queries for DB ID:", dbEntryId);
        if (!dbEntryId) {
          console.error("Error: Missing dbEntryId");
          return;
        }
        try {
          const url = `${
            import.meta.env.VITE_BACKEND_URL
          }/execute-query/?external_db_id=${dbEntryId}`;
          console.log("Fetching from URL:", url);
          const response = await apiRequest("GET", url);
          console.log("API Response:", response);
          if (!response) {
            console.error(" No response received");
            throw new Error("No response received");
          }
          if (Array.isArray(response)) {
            console.log("Response is an array with", response.length, "items");
            set({ queries: response });
            return;
          }
          if (response && !response.data && typeof response === "object") {
            console.log("Response is an object, checking if valid");
            set({ queries: response });
            return;
          }
          if (response && response.data) {
            const queries = Array.isArray(response.data)
              ? response.data
              : response.data.queries || [];
            if (!Array.isArray(queries)) {
              console.error(" Queries is not an array:", queries);
              throw new Error("Invalid queries format");
            }
            set({ queries });
            console.log(" Queries stored successfully:", queries);
            return;
          }
          console.error(" Unhandled response format:", response);
          throw new Error("Invalid API response");
        } catch (error) {
          console.error(" Error fetching queries:", error);
        }
      },

      loadMoreQueries: async (dbEntryId) => {
        set({ isLoading: true });
        console.log(" Fetching next 10 queries for DB ID:", dbEntryId);
        if (!dbEntryId) {
          console.error("Error: Missing dbEntryId");
          return;
        }
        try {
          const url = `${
            import.meta.env.VITE_BACKEND_URL
          }/execute-query/load-more/?external_db_id=${dbEntryId}`;

          const response = await apiRequest("GET", url);
          console.log("Load more response:", response);

          if (
            !response ||
            !response.queries_list ||
            response.queries_list.length === 0
          ) {
            set({ hasMore: false });
            return;
          }

          const newQueries = response.queries_list;

          set((state) => ({
            queries: {
              ...state.queries,
              queries_list: newQueries,
            },
          }));
        } catch (error) {
          console.error("Error loading more queries:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      // executeQuery: async (queryId) => {
      //   console.log("Executing query ID:", queryId);

      //   try {
      //     const query = get().queries.queries_list.find(
      //       (q) => q.id === queryId
      //     );

      //     if (!query) {
      //       console.error("Query not found:", queryId);
      //       return null;
      //     }

      //     const dbEntryId = localStorage.getItem("current-db-entry-id");

      //     const url = `${import.meta.env.VITE_BACKEND_URL}/execute-query/`;

      //     const requestBody = { query_id: queryId, external_db_id: dbEntryId };

      //     const response = await apiRequest("POST", url, requestBody);
      //     console.log("Query Result:", response);

      //     if (!response) {
      //       console.error("No response received");
      //       set({ queryResult: { error: "No response received" } });
      //       return null;
      //     }

      //     let formattedResult = {
      //       query: response.query || query.query,
      //       data: Array.isArray(response.result) ? response.result : [],
      //       chartType: response.chartType || query.chartType || "line",
      //       report: response.report || "",
      //     };

      //     if (!formattedResult.data.length) {
      //       formattedResult.error = "Empty result set";
      //     }

      //     set({ queryResult: formattedResult });

      //     return formattedResult;
      //   } catch (error) {
      //     console.error("Error executing query:", error);
      //     set({
      //       queryResult: { error: error.message || "Error executing query" },
      //     });
      //     return null;
      //   }
      // },
      executeQuery: async (queryId) => {
        console.log("Executing query ID:", queryId);

        try {
          const query = get().queries.queries_list.find(
            (q) => q.id === queryId
          );

          if (!query) {
            console.error("Query not found:", queryId);
            return null;
          }

          const dbEntryId = localStorage.getItem("current-db-entry-id");
          if (!dbEntryId) {
            console.error("Database entry ID not found in localStorage.");
            return null;
          }

          const url = `${import.meta.env.VITE_BACKEND_URL}/execute-query/`;
          const requestBody = { query_id: queryId, external_db_id: dbEntryId };

          const response = await apiRequest("POST", url, requestBody);

          if (!response || response.error) {
            console.error(
              "Error in API response:",
              response?.error || "Unknown error"
            );
            set({
              queryResult: { error: response?.error || "API request failed" },
            });
            return null;
          }

          console.log("Query Result:", response);

          let formattedResult = {
            query: response.query || query.query || "No query provided",
            data: Array.isArray(response.result) ? response.result : [],
            chartType: response.chartType || query.chartType || "line",
            report: response.report || "",
          };

          if (!formattedResult.data.length) {
            formattedResult.error = "Empty result set";
          }

          set({ queryResult: formattedResult });

          return formattedResult;
        } catch (error) {
          console.error("Error executing query:", error);
          set({
            queryResult: { error: error.message || "Error executing query" },
          });
          return null;
        }
      },

      updateQueriesWithDateRange: async (queryIds, startDate, endDate) => {
        try {
          set({ isUpdatingQueries: true });

          const results = [];
          const allQueries = get().queries;
          const queriesToUpdate =
            queryIds.length > 0
              ? queryIds
                  .map((id) => allQueries.find((q) => q.id === id))
                  .filter(Boolean)
              : allQueries;

          for (const query of queriesToUpdate) {
            const result = await get().executeQuery(
              query.id,
              startDate,
              endDate
            );
            if (result) {
              results.push({
                queryId: query.id,
                result,
              });
            }
          }

          set({
            batchQueryResults: results,
            isUpdatingQueries: false,
          });

          return results;
        } catch (error) {
          console.error("Error updating queries with date range:", error);
          set({ isUpdatingQueries: false });
          return [];
        }
      },

      setSelectedQuery: (query) => set({ selectedQuery: query }),

      addQueriesToDashboard: async (
        dashboardId,
        queryIds,
        dashboardName = null
      ) => {
        try {
          if (!dashboardId || !queryIds.length) {
            throw new Error(
              "Dashboard ID and at least one Query ID are required."
            );
          }

          const payload = {
            dashboard_id: dashboardId,
            query_ids: Array.isArray(queryIds) ? queryIds : [queryIds],
          };

          if (dashboardName) {
            payload.name = dashboardName;
          }

          const response = await apiRequest(
            "PATCH",
            `${
              import.meta.env.VITE_BACKEND_URL
            }/execute-query/add-queries-to-dashboard`,
            payload
          );

          await get().fetchDashboardChartData(dashboardId);

          return response;
        } catch (error) {
          console.error("API Error:", error);
          set({
            dashboardError:
              error.message || "Failed to add queries to dashboard",
          });
          throw error;
        }
      },

      fetchDashboardChartData: async (dashboardId) => {
        try {
          if (!dashboardId) {
            throw new Error("Dashboard ID is required");
          }

          const response = await apiRequest(
            "GET",
            `${
              import.meta.env.VITE_BACKEND_URL
            }/execute-query/dashboard/chart-data`,
            null,
            {
              dashboard_id: dashboardId,
            }
          );
          console.log(response);
          if (!response || !response.chart_data) {
            throw new Error("Invalid chart data response");
          }

          set({
            dashboardQueries: response.chart_data,
            dashboardError: null,
          });

          return response.chart_data;
        } catch (error) {
          console.error("Failed to fetch dashboard chart data:", error);
          set({
            dashboardError: error.message || "Failed to fetch chart data",
          });
          throw error;
        }
      },

      removeFromDashboard: (queryId) => {
        set((state) => ({
          dashboardQueries: state.dashboardQueries.filter(
            (q) => q.id !== queryId
          ),
        }));
      },

      updateChartType: (queryId, chartType) => {
        set((state) => ({
          dashboardQueries: state.dashboardQueries.map((q) =>
            q.id === queryId ? { ...q, chartType } : q
          ),
        }));
      },
    }),
    {
      name: "query-dashboard-store",
      getStorage: () => localStorage,
    }
  )
);

export default useQueryStore;
