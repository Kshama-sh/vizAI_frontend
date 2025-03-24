import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiRequest } from "@/api/access_token";

const useQueryStore = create(
  persist(
    (set, get) => ({
      queries: {
        queries_list: [],
        user_generated: [],
      },
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

      clearDashboardQueries: () => set({ dashboardQueries: [] }),

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

          const queries_list = response.queries_list || [];
          const user_generated = response.user_generated || [];

          set({ queries: { queries_list, user_generated } });

          console.log("Queries stored successfully:", {
            queries_list,
            user_generated,
          });
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

      executeQuery: async (queryId) => {
        console.log("Executing query ID:", queryId);
        try {
          let query = get().queries.queries_list.find((q) => q.id === queryId);
          if (!query && get().queries.user_generated) {
            query = get().queries.user_generated.find((q) => q.id === queryId);
          }

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
            chartType: response.chartType || query.chart_type || "line",
            report: response.report || "",
            x_axis: response.x_axis || "",
            y_axis: response.y_axis || "",
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
          set({ dashboardQueries: [] });
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
            dashboardQueries: [],
          });
          throw error;
        }
      },

      removeQueriesFromDashboard: async (dashboardId, queryIds) => {
        try {
          if (!dashboardId || !queryIds.length) {
            throw new Error(
              "Dashboard ID and at least one Query ID are required"
            );
          }

          const payload = {
            dashboard_id: dashboardId,
            query_ids: Array.isArray(queryIds) ? queryIds : [queryIds],
          };

          const response = await apiRequest(
            "DELETE",
            `${
              import.meta.env.VITE_BACKEND_URL
            }/execute-query/dashboard/delete-queries`,
            payload
          );
          return response;
        } catch (error) {
          console.error("Failed to remove queries from dashboard:", error);
          throw error;
        }
      },
    }),
    {
      name: "query-dashboard-store",
      getStorage: () => localStorage,
    }
  )
);

export default useQueryStore;
