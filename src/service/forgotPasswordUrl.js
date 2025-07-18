// forgotPasswordUrl.js

import config from "./config";

export const resetPassword = async (email, newPassword) => {
  try {
    const response = await fetch(`${config.BASE_URL}auth/forgotPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password: newPassword }),
    });

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      const errorData = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      throw new Error(
        errorData?.message || errorData || "Failed to reset password"
      );
    }

    return contentType?.includes("application/json")
      ? await response.json()
      : { message: await response.text() };
  } catch (error) {
    throw new Error(
      error.message || "An error occurred while resetting the password."
    );
  }
};
