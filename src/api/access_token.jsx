import axios from "axios";

const getAccessToken = () => {
  try {
    const token = localStorage.getItem("accessToken");
    console.log(localStorage.getItem("accessToken"));

    if (!token) {
      console.error("Access Token is missing!");
      return null;
    }
    return token;
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    return null;
  }
};

export const apiRequest = async (
  method,
  endpoint,
  data = null,
  params = {}
) => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Unauthorized: No access token found");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`, // Ensure correct header
    };

    const response = await axios({
      method,
      url: endpoint,
      data,
      params,
      headers,
    });

    return response.data;
  } catch (error) {
    console.error(
      "API Request Error:",
      error.response?.data?.detail || error.response?.data || error.message
    );
    throw error.response?.data || { message: error.message };
  }
};
