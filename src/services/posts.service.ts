import { api } from "@/lib/api";

export const postsService = {
  createPost: async (payload: {
    title: string;
    content: string;
    authorUserId: number;
  }) => {
    const { data } = await api.post("/posts", payload);
    return data;
  },
  getPosts: async (page: number, limit: number, userId?: number) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (userId) {
      params.append("userId", userId.toString());
    }
    const { data } = await api.get(`/posts?${params.toString()}`);
    return data.data; // Unwraps the standard NestJS interceptor { data: { data, meta }, message, statusCode }
  },
  updatePost: async (payload: {
    id: string;
    title: string;
    content: string;
  }) => {
    const { data } = await api.put(`/posts/${payload.id}`, {
      title: payload.title,
      content: payload.content,
    });
    return data;
  },
  deletePost: async (postId: string) => {
    const { data } = await api.delete(`/posts/${postId}`);
    return data;
  },
};
