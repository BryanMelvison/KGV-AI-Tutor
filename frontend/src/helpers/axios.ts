"use client";

import axios from "axios";
// import { refreshToken } from "@/api/auth";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// add access token to the headers
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("anh-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("401 Unauthorized – token expired or invalid.");
      sessionStorage.removeItem("anh-token");
      sessionStorage.removeItem("anh-user");

      if (typeof window !== "undefined") {
        window.location.href = "/login?expired=true";
      }
    }
    return Promise.reject(error);
  }
);

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       const refreshTokenValue = sessionStorage.getItem("anh-refresh-token");
//       if (refreshTokenValue) {
//         try {
//           const res = await refreshToken(refreshTokenValue);
//           const newAccessToken = res.data.access_token;
//           sessionStorage.setItem("anh-token", newAccessToken);

//           originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
//           return api(originalRequest);
//         } catch (err) {
//           console.error("Refresh token error", err);
//           window.location.href = "/login";
//         }
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default api;
