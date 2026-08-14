"use client";

import { createContext, useContext, useState } from "react";
import type { AuthUser } from "./auth-cookies";

export type { AuthUser };

interface AuthContextValue {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  tosRequired: boolean;
  setTosRequired: (required: boolean) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  setUser: () => {},
  tosRequired: false,
  setTosRequired: () => {},
});

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: AuthUser | null;
}) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [tosRequired, setTosRequired] = useState(false);

  return (
    <AuthContext.Provider value={{ user, setUser, tosRequired, setTosRequired }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function getUserInitials(user: AuthUser): string {
  if (user.displayName) {
    return user.displayName
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return user.email[0].toUpperCase();
}
