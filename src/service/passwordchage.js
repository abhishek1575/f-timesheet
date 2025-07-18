// src/service/AuthService.js

import axios from "axios";
import Config from "./config";

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const token = sessionStorage.getItem("token");
    const id = sessionStorage.getItem("UserId");

    if (!token || !id) {
      throw new Error("Token or User ID is missing");
    }
    console.log("Old password:", oldPassword + " new password:", newPassword + " id:", id + " token:", token);
    const response = await axios.post(
      `${Config.BASE_URL}auth/changePassword`,
      {
        id: parseInt(id, 10),
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

    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};
