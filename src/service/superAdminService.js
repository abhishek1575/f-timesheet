// src/service/superAdminService.js
import axios from "axios";
import config from "./config";

const BASE_URL = config.BASE_URL;
const token = sessionStorage.getItem("token");
const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

const superAdminService = {
  getAllUsers: () => axios.get(`${BASE_URL}users/all`, { headers }),
  getAdmins: () => axios.get(`${BASE_URL}users/admin`, { headers }),
  getPrivilegedUsers: () =>
    axios.get(`${BASE_URL}users/privileged`, { headers }),
  updateUser: (id, data) =>
    axios.put(`${BASE_URL}users/update/${id}`, data, { headers }),
  deleteUser: (id) => axios.delete(`${BASE_URL}users/${id}`, { headers }),
  reactivateUser: (id) =>
    axios.put(`${BASE_URL}users/${id}/reactivate`, {}, { headers }),
  assignManager: (userId, managerId) =>
    axios.put(
      `${BASE_URL}users/assignManager?userId=${userId}&managerId=${managerId}`,
      {},
      { headers }
    ),
  removeManager: (userId) =>
    axios.put(`${BASE_URL}users/${userId}/remove-manager`, {}, { headers }),
  getTimesheetsByUser: (userId) =>
    axios.get(`${BASE_URL}sheets/team/${userId}`, { headers }),
  registerUser: (data) =>
    axios.post(`${BASE_URL}auth/register`, data, { headers }),
  getTeamByManager: (managerId) =>
    axios.get(`${BASE_URL}users/team/${managerId}`, { headers }),
};

export default superAdminService;

