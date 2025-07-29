// src/services/userService.js
import config from "./config";
import axios from "axios";


export const fetchUserById = async (userId, token) => {
  console.log("Fetching user details for ID:", userId);
  const response = await fetch(`${config.BASE_URL}users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
     const errorText = await response.text();
     throw new Error(`Failed to fetch user: ${response.status} - ${errorText}`);
  }

  return response.json();
};

export const fetchManagersOrAdmins = async (role, token) => {
  let url = "";
  if (role === "EMPLOYEE") {
    url = `${config.BASE_URL}users/managers`;
  } else if (role === "MANAGER") {
    url = `${config.BASE_URL}users/admin`;
  }

  if (url) {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch managers/admins");
    }

    return response.json();
  }

  return [];
};

export const updateUser = async (userId, formData, token) => {
  const response = await fetch(`${config.BASE_URL}users/update/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return response;
};


export async function registerEmployee(data, token) {
  try {
    const response = await axios.post(`${config.BASE_URL}auth/register`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Register error:", error);

    if (error.response) {
      throw new Error(error.response.data.message || "Registration failed");
    } else {
      throw new Error("Network error or server not reachable");
    }
  }
}

 // if needed

export const getProjectsByUser = async (userId) => {
  const token = sessionStorage.getItem("token");
  const res = await fetch(`${config.BASE_URL}projects/by-user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }

  return await res.json();
};
