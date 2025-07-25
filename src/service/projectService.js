// src/services/projectService.js
import axios from "axios";
import config from "./config"; // Update if different

const getAuthHeaders = () => {
  const token = sessionStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAllProjects = async () => {
  return axios.get(`${config.BASE_URL}projects/all`, getAuthHeaders());
};

export const getAllEmployees = async () => {
  return axios.get(`${config.BASE_URL}users/employees`, getAuthHeaders());
};

export const assignEmployeeToProject = async (projectId, employeeId) => {
  return axios.put(
    `${config.BASE_URL}projects/${projectId}/add-member/${employeeId}`,
    {}, // Empty body
    getAuthHeaders()
  );
};

export const assignManagerToProject = async (projectId, managerId) => {
  return axios.put(
    `${config.BASE_URL}projects/${projectId}/assign-manager/${managerId}`,
    {},
    getAuthHeaders()
  );
};

export const createProject = async (projectData) => {
  return axios.post(`${config.BASE_URL}projects/create`, projectData, {
    ...getAuthHeaders(),
    headers: {
      ...getAuthHeaders().headers,
      "Content-Type": "application/json",
    },
  });
};

export const getAllPrivilegedUsers = async () => {
  return axios.get(`${config.BASE_URL}users/managers`, getAuthHeaders());
};
