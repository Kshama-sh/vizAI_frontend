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
      dashboards: [{ id: "default", name: "Main Dashboard" }],
      activeDashboardId: "default",

      //fetch the query
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
        //const dbEntryId = localStorage.getItem("current-db-entry-id");
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
            set({ hasMore: false }); // No more queries to load
            return;
          }

          const newQueries = response.queries_list;

          // Replace the existing queries with the new ones
          set((state) => ({
            queries: {
              ...state.queries,
              queries_list: newQueries, // Replace old queries with new ones
            },
          }));
        } catch (error) {
          console.error("Error loading more queries:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      //fetch the result of the query
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

          const url = `${import.meta.env.VITE_BACKEND_URL}/execute-query/`;

          const requestBody = { query_id: queryId, external_db_id: dbEntryId };

          const response = await apiRequest("POST", url, requestBody);
          console.log("Query Result:", response);

          if (!response) {
            console.error("No response received");
            set({ queryResult: { error: "No response received" } });
            return null;
          }

          let formattedResult = {
            query: response.query || query.query,
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

      // Add to queryStore.js
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

      // Dashboard management
      addDashboard: (name) => {
        const dashboardId = `dashboard-${Date.now()}`;
        set((state) => ({
          dashboards: [...state.dashboards, { id: dashboardId, name }],
        }));
        return dashboardId;
      },
      //remove dashboard
      removeDashboard: (dashboardId) => {
        set((state) => {
          // Don't remove default dashboard
          if (dashboardId === "default") return state;

          // If removing active dashboard, set default as active
          const newState = {
            dashboards: state.dashboards.filter((d) => d.id !== dashboardId),
          };

          if (state.activeDashboardId === dashboardId) {
            newState.activeDashboardId = "default";
          }

          return newState;
        });
      },

      setActiveDashboard: (dashboardId) => {
        set({ activeDashboardId: dashboardId });
      },

      // Query visualization management
      addToDashboard: (query, dashboardId = null) => {
        const targetDashboard = dashboardId || get().activeDashboardId;

        set((state) => {
          // Check if the query is already in the dashboard
          if (!state.dashboardQueries.some((q) => q.id === query.id)) {
            return {
              dashboardQueries: [
                ...state.dashboardQueries,
                {
                  ...query,
                  dashboardId: targetDashboard,
                  chartType: query.chartType || "line", // Default chart type
                },
              ],
            };
          }
          return state;
        });
      },

      removeFromDashboard: (queryId) => {
        set((state) => ({
          dashboardQueries: state.dashboardQueries.filter(
            (q) => q.id !== queryId
          ),
        }));
      },

      // Update chart visualization type
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
