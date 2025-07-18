// src/services/userService.js
import config from "./config";

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
