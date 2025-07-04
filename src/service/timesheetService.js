import config from "./config";


export const getAllTimesheets = async () => {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) {
      throw new Error("No token found in session storage");
    }

    console.log("Fetching timesheets for current user...");

    const response = await fetch(`${config.BASE_URL}sheets/my`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error:", errorText);
      throw new Error("Failed to fetch timesheets");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching timesheets:", error);
    throw error;
  }
};

// src/services/timesheetService.js

export const createTimesheet = async (timesheetData) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.post(`${config.BASE_URL}sheets/create`, timesheetData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};


export const submitTimesheet = async (timesheetId) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.put(
      `${config.BASE_URL}/${timesheetId}/submit`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

import axios from "axios";




// Get all draft timesheets
export const getDraftTimesheets = () => {
  const getToken = () =>{sessionStorage.getItem("token") || localStorage.getItem("token")};
  return axios.get(`${config.BASE_URL}sheets/draft`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

// Get timesheet by ID
export const getTimesheetById = (id) => {
  const getToken = () =>{sessionStorage.getItem("token") || localStorage.getItem("token")};
  return axios.get(`${config.BASE_URL}sheets/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

// Update timesheet
export const updateTimesheet = (id, data) => {
  const getToken = () =>{sessionStorage.getItem("token") || localStorage.getItem("token")};
  return axios.put(`${config.BASE_URL}sheets/${id}`, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  });
};

