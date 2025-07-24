import axios from "axios";
import config from "./config"; // Ensure this file exports BASE_URL

export const createProject = async (projectData) => {
  try {
    const token = sessionStorage.getItem("Token");

    const response = await axios.post(
      `${config.BASE_URL}/projects/create`,
      projectData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};
