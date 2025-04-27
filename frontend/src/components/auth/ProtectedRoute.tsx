"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: ("student" | "teacher")[];
}) => {
  const { user, userLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (userLoaded) {
      if (!user) {
        router.push("/login");
      } else if (!allowedRoles.includes(user.role)) {
        router.push("/unauthorized");
      }
    }
  }, [user, userLoaded, router, allowedRoles]);

  return <>{user && allowedRoles.includes(user.role) ? children : null}</>;
};

export default ProtectedRoute;
