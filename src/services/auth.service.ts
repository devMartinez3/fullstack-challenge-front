import { api } from "@/lib/api";

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const { data } = await api.post("/auth/login", credentials);
    return data.data; // The NestJS interceptor wraps responses in { data, message, statusCode }
  },
};
