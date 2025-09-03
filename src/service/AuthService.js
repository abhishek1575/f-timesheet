import axios from "axios";
import config from "./config.jsx";

const BASE_URL = config.BASE_URL + "auth/";

class AuthService {
  async login(email, password) {
    const response = await axios.post(
      BASE_URL + "login",
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.jwt) {
      
      sessionStorage.setItem("UserId", response.data.id);
      sessionStorage.setItem("Email", response.data.email);
      sessionStorage.setItem("Name", response.data.name);
      sessionStorage.setItem("Role", response.data.role);
      sessionStorage.setItem("type", response.data.type);
      sessionStorage.setItem("token", response.data.jwt);
      sessionStorage.setItem("isLoggedIn", true);

      // ✅ Set ManagerId if available
      if (
        response.data.managerId !== null &&
        response.data.managerId !== undefined
      ) {
        sessionStorage.setItem("ManagerId", response.data.managerId);
      } else {
        sessionStorage.removeItem("ManagerId"); // cleanup for admins
      }


    }
    return response;
  }

  logout() {
    sessionStorage.clear();
  }

  getCurrentUser() {
    return {
      id: sessionStorage.getItem("UserId"),
      name: sessionStorage.getItem("Name"),
      email: sessionStorage.getItem("Email"),
      role: sessionStorage.getItem("Role"),
      token: sessionStorage.getItem("token"),
      type: sessionStorage.getItem("Type"),
    };
  }

  authHeader() {
    const token = sessionStorage.getItem("token");
    if (token) {
      return { Authorization: `Bearer ${token}` };
    } else {
      return {};
    }
  }
}

export default new AuthService();
