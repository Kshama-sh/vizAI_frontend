import axios from "axios";

const getAccessToken = () => localStorage.getItem("accessToken");

export const apiRequest = async (
  method,
  endpoint,
  data = null,
  params = {}
) => {
  try {
    const accessToken = getAccessToken();

    const headers = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {};

    const response = await axios({
      method,
      url: endpoint, // Fix: Use endpoint instead of url
      data,
      params,
      headers,
    });

    return response.data;
  } catch (error) {
    console.error("API Request Error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
