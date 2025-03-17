import { create } from "zustand";
import { persist } from "zustand/middleware";
const dummyQueries = [
  {
    id: 1,
    title: "What is the trend of total salary expenditure over the past year?",
    chartType: "line",
    data: [
      { label: "1987-06", value: 24000 },
      { label: "1987-09", value: 4400 },
      { label: "1989-09", value: 17000 },
      { label: "1990-01", value: 9000 },
      { label: "1991-05", value: 6000 },
    ],
    report:
      "This line chart illustrates the trend of total salary expenditure over the past year. The data points show fluctuations, with a peak expenditure of $24,000 in mid-1987 and a dip to $4,400 in late 1987. This suggests seasonal variations or changes in hiring patterns.",
  },
  {
    id: 2,
    title:
      "What is the average salary by department over the specified time period?",
    chartType: "bar",
    data: [
      { label: "Executive", value: 19333 },
      { label: "IT", value: 5760 },
      { label: "Finance", value: 8600 },
      { label: "Purchasing", value: 4150 },
      { label: "Shipping", value: 5885 },
    ],
    report:
      "This bar chart presents the average salary distribution across different departments. The Executive department has the highest average salary at $19,333, while the Purchasing department has the lowest at $4,150. This highlights salary disparities among departments.",
  },
  {
    id: 3,
    title:
      "What is the quarterly total salary expenditure trend over the last 2 years?",
    chartType: "area",
    data: [
      { label: "1987-Q2", value: 24000 },
      { label: "1987-Q3", value: 4400 },
      { label: "1989-Q3", value: 17000 },
      { label: "1990-Q1", value: 9000 },
      { label: "1991-Q2", value: 6000 },
    ],
    report:
      "This area chart shows the quarterly total salary expenditure trend over two years. A significant drop is observed in late 1987, followed by fluctuations, indicating possible workforce changes or budget adjustments.",
  },
  {
    id: 4,
    title:
      "What is the year-over-year change in average salary for each job title?",
    chartType: "line",
    data: [
      { label: "President (1987)", value: 24000 },
      { label: "Admin VP (1989)", value: 17000 },
      { label: "Programmer (1990)", value: 9000 },
      { label: "Finance Manager (1994)", value: 12000 },
      { label: "Accountant (1994)", value: 9000 },
    ],
    report:
      "This line chart visualizes the year-over-year changes in average salary for various job titles. The data reveals fluctuations, with a noticeable drop for programmers and a peak for presidents, indicating shifting salary structures.",
  },
  {
    id: 5,
    title:
      "How does the monthly salary expenditure change within each department over the defined period?",
    chartType: "line",
    data: [
      { label: "Accounting-06", value: 20300 },
      { label: "Administration-09", value: 4400 },
      { label: "Executive-01", value: 17000 },
      { label: "Finance-03", value: 7800 },
      { label: "Finance-08", value: 21000 },
    ],
    report:
      "This line chart illustrates salary expenditure trends for different departments over time. The Finance department exhibits variability, with a peak of $21,000, while Administration remains lower.",
  },
  {
    id: 6,
    title: "What is the distribution of salaries across different departments?",
    chartType: "bar",
    data: [
      { label: "Administration", value: 4400 },
      { label: "Marketing", value: 9500 },
      { label: "Purchasing", value: 4150 },
      { label: "Human Resources", value: 6500 },
      { label: "Shipping", value: 5885 },
    ],
    report:
      "This bar chart depicts the distribution of salaries across departments. Marketing and Human Resources have relatively higher salaries, while Purchasing and Administration have lower salary figures.",
  },
  {
    id: 7,
    title: "What is the salary range for each job title?",
    chartType: "bar",
    data: [
      { label: "Public Accountant", value: [4200, 9000] },
      { label: "Accounting Manager", value: [8200, 16000] },
      { label: "President", value: [20000, 40000] },
      { label: "Admin VP", value: [15000, 30000] },
      { label: "Programmer", value: [4000, 10000] },
    ],
    report:
      "This bar chart represents salary ranges for various job titles. The President position has the widest range ($20,000-$40,000), while Public Accountants have a lower range ($4,200-$9,000).",
  },
  {
    id: 8,
    title: "What is the employee headcount by department?",
    chartType: "pie",
    data: [
      { label: "Administration", value: 1 },
      { label: "Marketing", value: 2 },
      { label: "Purchasing", value: 6 },
      { label: "Human Resources", value: 1 },
      { label: "Shipping", value: 7 },
    ],
    report:
      "This pie chart displays the number of employees per department. The Shipping department has the highest headcount (7), whereas Administration and Human Resources have the lowest (1 each).",
  },
  {
    id: 9,
    title: "What is the ratio of minimum to maximum salary for each job?",
    chartType: "bar",
    data: [
      { label: "Public Accountant", value: 0.47 },
      { label: "Accounting Manager", value: 0.51 },
      { label: "Admin Assistant", value: 0.5 },
      { label: "President", value: 0.5 },
      { label: "Programmer", value: 0.4 },
    ],
    report:
      "This bar chart shows the ratio of minimum to maximum salary for different jobs. The Accounting Manager position has the highest ratio (0.51), while the Programmer role has the lowest (0.4), indicating a wider salary range.",
  },
  {
    id: 10,
    title:
      "How does the average salary correlate with the job's minimum salary requirement?",
    chartType: "scatter",
    data: [
      { label: "4200", value: 7983 },
      { label: "8200", value: 12000 },
      { label: "3000", value: 4400 },
      { label: "20000", value: 24000 },
      { label: "15000", value: 17000 },
    ],
    report:
      "This scatter plot shows the correlation between a job's minimum salary requirement and the average salary. Higher minimum salary jobs tend to have proportionally higher average salaries, suggesting a direct relationship.",
  },
];
const backendUrl = import.meta.env.BACKEND_URL;
const useQueryStore = create(
  persist(
    (set, get) => ({
      queries: dummyQueries,
      //queries:[],
      selectedQuery: null,
      queryResult: null,
      dashboardQueries: [],

      //Fetch query titles from backend
      // fetchQueryTitles: async () => {
      //   try {
      //     const response = await apiRequest(
      //       "GET",
      //       `${backendUrl}/users/signup`
      //     );
      //     if (!response || !response.data)
      //       throw new Error("Invalid API response");
      //     set({ queries: response.data.queries || response.data });
      //   } catch (error) {
      //     console.error("Error fetching query titles:", error);
      //   }
      // },

      //Fetch query results when preview is clicked
      // executeQuery: async (queryId) => {
      //   try {
      //     const response = await apiRequest(
      //       "GET",
      //       `${backendUrl}/users/signup`
      //     );
      //     set({ queryResult: response.data });
      //   } catch (error) {
      //     console.error("Error fetching query result:", error);
      //   }
      // },

      executeQuery: (queryId) => {
        const queries = get().queries;
        const query = queries.find((q) => q.id === queryId);
        if (query) {
          set({ queryResult: query });
        } else {
          console.error("Query not found:", queryId);
        }
      },

      setSelectedQuery: (query) => set({ selectedQuery: query }),
      // dashboards: {
      //   1: { name: "Dashboard 1", queries: [] }, // Default dashboard
      // },
      // activeDashboard: "1",

      // addDashboard: (name) =>
      //   set((state) => {
      //     const newId = String(Object.keys(state.dashboards).length + 1);
      //     return {
      //       dashboards: {
      //         ...state.dashboards,
      //         [newId]: { name, queries: [] },
      //       },
      //     };
      //   }),

      // setActiveDashboard: (dashboardId) =>
      //   set(() => ({ activeDashboard: dashboardId })),

      addToDashboard: (query) => {
        set((state) => {
          const exists = state.dashboardQueries.some((q) => q.id === query.id);
          if (!exists) {
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
