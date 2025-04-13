import { useEffect, useState } from "react";
import { verifyUser } from "@/api/auth";
import { useUser } from "@/context/UserContext";

export const useVerifyUser = () => {
  const [loading, setLoading] = useState(true);
  const { login, logout } = useUser();

  useEffect(() => {
    const run = async () => {
      try {
        const res = await verifyUser();
        login({ displayName: res.displayName, role: res.role }, "");
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return { loading };
};
