import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
  role: string;
}

const getAuthUserFromCookie = (): AuthUser | null => {
  const cookieValue = Cookies.get("auth_user");
  if (!cookieValue || cookieValue === "undefined") {
    return null;
  }
  try {
    return JSON.parse(cookieValue);
  } catch (error) {
    return null;
  }
};

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: Cookies.get("auth_token") || null,
      user: getAuthUserFromCookie(),
      isAuthenticated: !!Cookies.get("auth_token"),
      setAuth: (token: string, user: AuthUser) => {
        Cookies.set("auth_token", token, { expires: 1 }); // Expires in 1 day
        Cookies.set("auth_user", JSON.stringify(user), { expires: 1 });
        set({ token, user, isAuthenticated: true });
      },
      logout: () => {
        Cookies.remove("auth_token");
        Cookies.remove("auth_user");
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage", // name of item in the storage (must be unique)
    },
  ),
);
