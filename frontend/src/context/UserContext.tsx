"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  displayName: string;
  role: "student" | "teacher";
}

interface UserContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("kgv-user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem("kgv-user", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("kgv-user");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
