import config from "./config";
import axios from "axios";

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
      `${config.BASE_URL}sheets/${timesheetId}/submit`,
      {}, // No body needed here
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


// Get all draft timesheets
export const getDraftTimesheets = () => {
  const token = sessionStorage.getItem("token") || localStorage.getItem("token");
  return axios.get(`${config.BASE_URL}sheets/draft`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


// Get timesheet by ID
export const getTimesheetById = async (timesheetId) => {
  const token = sessionStorage.getItem("token") || localStorage.getItem("token");
  return axios.get(`${config.BASE_URL}sheets/${timesheetId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


// Update timesheet
export const updateTimesheet = async (timesheetId, timesheetData) => {
  const token =
    sessionStorage.getItem("token") || localStorage.getItem("token");
  try {
    const response = await axios.put(
      `${config.BASE_URL}sheets/${timesheetId}`,
      timesheetData,
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

