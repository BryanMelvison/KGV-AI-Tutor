import api from "@/helpers/axios";

export const loginUser = (email: string, password: string) => {
  return api.post("/login", { email, password });
};
