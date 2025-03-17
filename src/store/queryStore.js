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

      //fetching query titles
      fetchQueryTitles: async (dbEntryId) => {
        console.log(" Fetching queries for DB ID:", dbEntryId);

        if (!dbEntryId) {
          console.error("Error: Missing dbEntryId");
          return;
        }

        try {
          const url = `http://192.168.94.112:8000/execute-query/?external_db_id=${dbEntryId}`;
          console.log("Fetching from URL:", url);

          const response = await apiRequest("GET", url);
          console.log("API Response:", response);

          // Check if response exists
          if (!response) {
            console.error(" No response received");
            throw new Error("No response received");
          }

          // Handle case where response.data is directly an array
          if (Array.isArray(response)) {
            console.log("Response is an array with", response.length, "items");
            set({ queries: response });
            return;
          }

          // Handle case where response is the data object
          if (response && !response.data && typeof response === "object") {
            console.log("Response is an object, checking if valid");
            set({ queries: response });
            return;
          }

          // Handle case where response.data is the data (original expected format)
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
          // Don't rethrow to prevent crashing the app
        }
      },

      // Fetch query results
      executeQuery: async (queryId) => {
        console.log("⚡ Executing query ID:", queryId);

        try {
          const query = get().queries.find((q) => q.id === queryId);
          if (!query) {
            console.error(" Query not found:", queryId);
            return;
          }

          const url = `http://192.168.94.112:8000/execute-query-result/?query_id=${queryId}`;
          const response = await apiRequest("GET", url);
          console.log(" Query Result:", response);

          // Handle different response formats
          if (!response) {
            console.error(" No response received");
            set({ queryResult: { error: "No response received" } });
            return;
          }

          // Set the response directly if it exists
          if (response.data) {
            set({ queryResult: response.data });
          } else {
            set({ queryResult: response });
          }

          console.log(" Query result stored successfully");
        } catch (error) {
          console.error(" Error executing query:", error);
          set({
            queryResult: { error: error.message || "Error executing query" },
          });
        }
      },

      setSelectedQuery: (query) => set({ selectedQuery: query }),

      addToDashboard: (query) => {
        set((state) => {
          if (!state.dashboardQueries.some((q) => q.id === query.id)) {
            return { dashboardQueries: [...state.dashboardQueries, query] };
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
    }),
    {
      name: "query-dashboard-store",
      getStorage: () => localStorage,
    }
  )
);

export default useQueryStore;
