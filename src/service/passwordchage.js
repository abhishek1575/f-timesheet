import axios from "axios";
import Config from "./config";

export const changePassword = async (oldPassword, newPassword) => {
  try {
    // Retrieve token and id from sessionStorage
    const token = sessionStorage.getItem("token");
    const id = sessionStorage.getItem("UserId");

    // Check if token and id are present
    if (!token || !id) {
      console.error("Token or ID is missing");
      throw new Error("Token or User ID is missing");
    }

    // Make API call to change password
    const response = await axios.post(
      `${Config.BASE_URL}auth/changePassword`,
      {
        id: parseInt(id, 10), // Ensure id is sent as a number
        oldPassword,
        newPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // Return response data for further handling
  } catch (error) {
    console.error("API error:", error);
    throw error; // Re-throw for handling in Dashboard.jsx
  }
};
