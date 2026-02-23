import { api } from "@/lib/api";

export interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  latestUsers: Array<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
  }>;
  recentPosts: Array<{
    id: number;
    title: string;
    createdAt: string;
    author: {
      firstName: string;
      lastName: string;
    };
  }>;
}

export const statsService = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get("/stats");
    return data.data; // Unwraps the standard NestJS interceptor { data: { ... }, message, statusCode }
  },
};
