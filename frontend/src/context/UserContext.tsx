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
  userLoaded: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("kgv-user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setUserLoaded(true);
  }, []);

  const login = (user: User /*, token: string */) => {
    setUser(user);
    localStorage.setItem("kgv-user", JSON.stringify(user));
    // localStorage.setItem("kgv-token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("kgv-user");
    // localStorage.removeItem("kgv-token");
  };

  return (
    <UserContext.Provider value={{ user, userLoaded, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
