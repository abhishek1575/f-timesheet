import { fetchManagersOrAdmins } from "../../service/userService";

export const getSuggestionsBasedOnRole = async (role, token) => {
  try {
    let suggestions = [];
    if (role === "EMPLOYEE") {
      const managers = await fetchManagersOrAdmins("MANAGER", token);
      const admins = await fetchManagersOrAdmins("ADMIN", token);
      const combined = [...managers, ...admins];
      // Remove duplicates based on ID
      const unique = combined.filter(
        (v, i, a) => a.findIndex((t) => t.id === v.id) === i
      );
      suggestions = unique;
    } else if (role === "MANAGER") {
      suggestions = await fetchManagersOrAdmins("ADMIN", token);
    }
    // If ADMIN, no suggestions
    return suggestions;
  } catch (error) {
    console.error("Failed to get suggestions:", error);
    return [];
  }
};
