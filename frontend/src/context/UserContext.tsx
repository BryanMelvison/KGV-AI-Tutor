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
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("anh-user");
    const storedToken = localStorage.getItem("anh-token");
    // const storedRefreshToken = localStorage.getItem("anh-refresh-token");

    if (storedUser && storedToken) {
      // if (storedUser && storedToken && storedRefreshToken) {
      setUser(JSON.parse(storedUser));
    }
    setUserLoaded(true);
  }, []);

  const login = (user: User, access_token: string) => {
    // const login = (user: User, access_token: string, refresh_token: string) => {
    setUser(user);
    localStorage.setItem("anh-user", JSON.stringify(user));
    // localStorage.setItem("anh-refresh-token", refresh_token);
    localStorage.setItem("anh-token", access_token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("anh-user");
    // localStorage.removeItem("anh-refresh-token");
    localStorage.removeItem("anh-token");
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
