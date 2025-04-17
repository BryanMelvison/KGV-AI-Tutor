import api from "@/helpers/axios";

export const loginUser = (email: string, password: string) => {
  return api.post("/login/verify", { email, password });
};

export const logoutUser = () => {
  return api.post("/logout");
};

export const refreshToken = (refreshToken: string) => {
  return api.post("/refresh", { refresh_token: refreshToken });
};
