import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const requestUrl = error.config?.url || "";

    // Don't treat a failed login/register attempt (e.g. wrong
    // password) as a "session expired" event — that 401 is just
    // the login form's own validation, and should show its own
    // toast on the Login page, not force a redirect.
    const isAuthEndpoint =
      requestUrl.includes("/login") ||
      requestUrl.includes("/register");

    if (error.response?.status === 401 && !isAuthEndpoint) {
      const hadToken = !!localStorage.getItem("token");

      localStorage.removeItem("token");

      // Only bounce to /login if we're not already there, and
      // only show the "session expired" message if there actually
      // was a token that just got rejected/expired (as opposed to
      // simply never having logged in).
      if (window.location.pathname !== "/login") {
        if (hadToken) {
          sessionStorage.setItem(
            "sessionExpiredMessage",
            "Your session has expired. Please log in again."
          );
        }

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;