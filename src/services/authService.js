
import { apiRequest } from "./api.js";

// گرفتن CAPTCHA و salt از سرور
export async function getLoginChallenge() {
  return apiRequest("/api/auth/login", {
    method: "GET",
  });
}

// ارسال اطلاعات ورود به سرور
export async function login({
  username,
  password,
  salt,
  captcha_answer,
}) {
  const data = await apiRequest("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      username,
      password,
      salt,
      captcha_answer,
    },
  });

  if (!data?.access_token) {
    throw new Error("Login response did not include an access token.");
  }

  sessionStorage.setItem("access_token", data.access_token);
  sessionStorage.setItem("token_type", data.token_type || "Bearer");

  return data;
}

// پاک کردن توکن از مرورگر
export function logout() {
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("token_type");

}
