import axios from "axios";

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "https://ts.idicorp.ir"
).replace(/\/+$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    // "X-CSRFToken": document.cookie.split("; ")[0].split("=")[1] || ""
  },
});

// قبل از ارسال هر درخواست، توکن ورود را اضافه می‌کنیم.
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access_token");
    const tokenType = sessionStorage.getItem("token_type") || "Bearer";

    console.log("Token exists:", Boolean(token));
    console.log("Token type:", tokenType);

    if (token) {
      config.headers.Authorization = `${tokenType} ${token}`;

      // config.headers.Authorization = `Bearer ${token}`;
      //   config.headers.X-CSRFToken: document.cookie.split("; ")[0].split("=")[1] || ""
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// خطاهای سرور و شبکه را به پیام قابل‌فهم تبدیل می‌کنیم.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(
        new Error("Unable to connect to the server. Check your network.")
      );
    }

    const status = error.response.status;
    const data = error.response.data;

    let message =
      (typeof data === "string" && data) ||
      data?.detail ||
      data?.message ||
      data?.error ||
      `Request failed (${status})`;

    if (status === 401) {
      message =
        "Your session has expired or authentication failed. Please sign in again.";
    } else if (status === 422) {
      message =
        typeof data === "string"
          ? `Validation error: ${data}`
          : `Validation error: ${JSON.stringify(data)}`;
    } else if (status === 503) {
      message =
        "The service is temporarily unavailable. Please try again later.";
    }

    const apiError = new Error(message);
    apiError.status = status;
    apiError.data = data;

    return Promise.reject(apiError);
  }
);

// پاسخ سرور را مستقیماً برمی‌گردانیم، نه کل شیء Axios را.
export async function apiRequest(path, options = {}) {
  const response = await api.request({
    url: path,
    ...options,
  });

  return response.data;
}

export default api;
