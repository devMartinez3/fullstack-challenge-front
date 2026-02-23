import { api } from "@/lib/api";

export const usersService = {
  getSavedUsers: async (
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: any[]; meta: any }> => {
    const { data } = await api.get(`/users/saved?page=${page}&limit=${limit}`);
    return data.data; // Now contains { data: User[], meta: { total, page, ... } }
  },
  importUser: async (
    reqResId: number,
  ): Promise<{ data: any; message: string; statusCode: number }> => {
    const response = await api.post(`/users/import/${reqResId}`);
    return response.data;
  },
  deleteUser: async ({ id, adminId }: { id: number; adminId: number }) => {
    if (!id || !adminId) {
      throw new Error("Missing required parameters");
    }
    if (id === adminId) {
      throw new Error("You cannot delete yourself");
    }
    const { data } = await api.delete(`/users/saved/${id}?adminId=${adminId}`);
    return data;
  },
  updateProfile: async (
    id: number,
    data: {
      email?: string;
      firstName?: string;
      lastName?: string;
      avatar?: string;
    },
  ) => {
    const response = await api.patch(`/users/saved/${id}`, data);
    return response.data;
  },
  updateUserRole: async (
    id: number,
    role: "USER" | "ADMIN",
    adminId: number,
  ) => {
    const response = await api.patch(`/users/saved/${id}/role`, {
      role,
      adminId,
    });
    return response.data;
  },
  getUserById: async (id: number) => {
    const { data } = await api.get(`/users/saved/${id}`);
    return data.data; // The NestJS interceptor wraps responses in { data, message, statusCode }
  },
};
