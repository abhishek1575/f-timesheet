export function authHeader() {
  // Get token from sessionStorage
  const token = sessionStorage.getItem("token");

  if (token) {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  } else {
    return { "Content-Type": "application/json" };
  }
}
