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

export const fetchUserName = async (): Promise<string> => {
  const { data } = await api.get("/login/user-name");
  return data;
};

export const fetchUserRole = async (): Promise<
  "student" | "teacher" | "admin"
> => {
  const { data } = await api.get("/login/user-role");
  console.log("Raw role response:", data);

  const rawRole: string = data;
  const cleanRole = rawRole.replace("Role.", "").toLowerCase();

  return cleanRole as "student" | "teacher" | "admin";
};
