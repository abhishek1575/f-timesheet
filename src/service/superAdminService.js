// // src/service/superAdminService.js
// import axios from "axios";
// import config from "./config";

// const createAxiosInstance = () => {
//   const token = sessionStorage.getItem("token");

//   if (!token) {
//     throw new Error("No authentication token found");
//   }

//   return axios.create({
//     baseURL: config.BASE_URL,
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//     withCredentials: true, // Add this if your API requires credentials
//   });
// };

// const superAdminService = {
//   getAllUsers: async () => {
//     const instance = createAxiosInstance();
//     return instance.get("users/all");
//   },
//   getAdmins: async () => {
//     const instance = createAxiosInstance();
//     return instance.get("users/admin");
//   },
//   getPrivilegedUsers: async () => {
//     const instance = createAxiosInstance();
//     return instance.get("users/privileged");
//   },
//   updateUser: async (id, data) => {
//     const instance = createAxiosInstance();
//     return instance.put(`users/update/${id}`, data);
//   },
//   deleteUser: async (id) => {
//     const instance = createAxiosInstance();
//     return instance.delete(`users/${id}`);
//   },
//   reactivateUser: async (id) => {
//     const instance = createAxiosInstance();
//     return instance.put(`users/${id}/reactivate`, {});
//   },
//   assignManager: async (userId, managerId) => {
//     const instance = createAxiosInstance();
//     return instance.put(
//       `users/assignManager?userId=${userId}&managerId=${managerId}`,
//       {}
//     );
//   },
//   removeManager: async (userId) => {
//     const instance = createAxiosInstance();
//     return instance.put(`users/${userId}/remove-manager`, {});
//   },
//   getTimesheetsByUser: async (userId) => {
//     const instance = createAxiosInstance();
//     return instance.get(`sheets/team/${userId}`);
//   },
//   registerUser: async (data) => {
//     const instance = createAxiosInstance();
//     return instance.post("auth/register", data);
//   },
//   getTeamByManager: async (managerId) => {
//     const instance = createAxiosInstance();
//     return instance.get(`users/team/${managerId}`);
//   },
// };

// export default superAdminService;

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
