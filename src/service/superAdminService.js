import axios from "axios";
import { authHeader } from "../components/helpers/auth-header";

const API_URL = "http://localhost:8080";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add request interceptor to include auth header
apiClient.interceptors.request.use(
  (config) => {
    const headers = authHeader();
    config.headers = {
      ...config.headers,
      ...headers,
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const superAdminService = {
  getAllAdmins,
  getAllUsers,
  getPrivilegedUsers,
  assignManager,
  updateUser,
  deleteUser,
  reactivateUser,
  removeManager,
  getUserTimesheets,
};

async function handleRequest(request) {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

function getAllAdmins() {
  return handleRequest(apiClient.get("/users/admin"));
}

function getAllUsers() {
  return handleRequest(apiClient.get("/users/all"));
}

function getPrivilegedUsers() {
  return handleRequest(apiClient.get("/users/privileged"));
}

function assignManager(userId, managerId) {
  return handleRequest(
    apiClient.put(
      `/users/assignManager?userId=${userId}&managerId=${managerId}`
    )
  );
}

function updateUser(id, userData) {
  return handleRequest(apiClient.put(`/users/update/${id}`, userData));
}

function deleteUser(id) {
  return handleRequest(apiClient.delete(`/users/${id}`));
}

function reactivateUser(id) {
  return handleRequest(apiClient.put(`/users/${id}/reactivate`));
}

function removeManager(userId) {
  return handleRequest(apiClient.put(`/users/${userId}/remove-manager`));
}

function getUserTimesheets(userId) {
  return handleRequest(apiClient.get(`/sheets/team/${userId}`));
}
