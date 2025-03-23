export const fetchUserDashboards = async () => {
  const response = await apiRequest("GET", `/dashboards`);
  return response;
};

export const createDefaultDashboard = async () => {
  const response = await apiRequest("POST", `/dashboards/default`, {
    user_id: userId,
  });
  return response;
};

export const createNewDashboard = async (dashboardData) => {
  const response = await apiRequest("POST", `/dashboards`, dashboardData);
  return response;
};

export const fetchChartsForDashboard = async (dashboardId) => {
  const response = await apiRequest("GET", `/dashboards/${dashboardId}/charts`);
  return response;
};

export const deleteDashboard = async (dashboardId) => {
  const response = await apiRequest("DELETE", `/dashboards/${dashboardId}`);
  return response;
};

export const removeChartFromDashboard = async (dashboardId, chartId) => {
  const response = await apiRequest(
    "DELETE",
    `/dashboards/${dashboardId}/charts/${chartId}`
  );
  return response;
};
