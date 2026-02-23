"use client";

import { useState, use, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/users.service";
import { postsService } from "@/services/posts.service";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { Header } from "@/components/Header";
import {
  getProfileSchema,
  type ProfileFormValues,
} from "@/schemas/profile.schema";
import { useAuthStore } from "@/store/authStore";
import { UserProfileCard } from "./components/UserProfileCard";
import { UserPostsGrid } from "./components/UserPostsGrid";
import { PostDialog } from "./components/PostDialog";
import { DeletePostAlertDialog } from "./components/DeletePostAlertDialog";
import { EditProfileDialog } from "./components/EditProfileDialog";
import { Paginator } from "@/components/Paginator";
import { useTranslations } from "next-intl";

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const userId = parseInt(resolvedParams.id, 10);
  const queryClient = useQueryClient();
  const { user: authUser } = useAuthStore();
  const t = useTranslations("userDetail");

  const postSchema = z.object({
    title: z
      .string()
      .min(10, { message: t("postForm.validation.titleMin") })
      .max(30, { message: t("postForm.validation.titleMax") }),
    content: z
      .string()
      .min(40, { message: t("postForm.validation.contentMin") })
      .max(500, { message: t("postForm.validation.contentMax") }),
  });

  type PostFormValues = z.infer<typeof postSchema>;

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const [postsPage, setPostsPage] = useState(1);
  const [postsLimit, setPostsLimit] = useState(3);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(getProfileSchema(t)),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      avatar: "",
    },
  });

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => usersService.getUserById(userId),
  });

  const { data: postsResponse, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["posts", userId, postsPage, postsLimit],
    queryFn: () => postsService.getPosts(postsPage, postsLimit, userId),
  });

  const createPostMutation = useMutation({
    mutationFn: postsService.createPost,
    onSuccess: () => {
      toast.success(t("toasts.postCreated"));
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["posts", userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsCreateOpen(false);
      form.reset();
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: postsService.updatePost,
    onSuccess: () => {
      toast.success(t("toasts.postUpdated"));
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["posts", userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsEditOpen(false);
      setEditingPostId(null);
      form.reset();
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: postsService.deletePost,
    onSuccess: () => {
      toast.success(t("toasts.postDeleted"));
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["posts", userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileFormValues) =>
      usersService.updateProfile(userId, data),
    onSuccess: () => {
      toast.success(t("toasts.profileUpdated"));
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // We don't update the auth store here immediately, but in a real app you might want to sync it.
      setIsEditProfileOpen(false);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t("toasts.profileUpdateError"),
      );
    },
  });

  const openEditModal = useCallback(
    (post: { id: string; title: string; content: string }) => {
      setEditingPostId(post.id);
      form.reset({
        title: post.title,
        content: post.content,
      });
      setIsEditOpen(true);
    },
    [form],
  );

  const openEditProfileModal = useCallback(() => {
    if (user) {
      profileForm.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar || "",
      });
      setIsEditProfileOpen(true);
    }
  }, [user, profileForm]);

  useEffect(() => {
    if (user && typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("editProfile") === "true" && authUser?.id === userId) {
        setTimeout(() => {
          openEditProfileModal();
        }, 0);
        // Clean up the URL without reloading the page
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, [user, authUser, userId, openEditProfileModal]); // Keep dependencies minimal to avoid constant re-triggering

  const onSubmitCreate = (data: PostFormValues) => {
    createPostMutation.mutate({
      title: data.title,
      content: data.content,
      authorUserId: userId,
    });
  };

  const onSubmitUpdate = (data: PostFormValues) => {
    if (!editingPostId) return;
    updatePostMutation.mutate({
      id: editingPostId,
      title: data.title,
      content: data.content,
    });
  };

  const onSubmitProfileUpdate = (data: ProfileFormValues) => {
    updateProfileMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">{t("loading.page")}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center space-y-4">
        <p className="text-xl">{t("errors.userNotFound")}</p>
        <Button asChild>
          <Link href="/">{t("navigation.backToDashboard")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50 dark:bg-background">
      <Header title={t("header.title")} showBack />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <UserProfileCard
            user={user}
            authUserId={authUser?.id}
            openEditProfileModal={openEditProfileModal}
          />

          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between my-4 gap-4 z-0">
            <h2 className="text-xl font-semibold w-full text-center sm:text-left sm:w-auto">
              {t("posts.title")}
            </h2>
            <Button
              className="w-full sm:w-auto"
              onClick={() => {
                form.reset({ title: "", content: "" });
                setIsCreateOpen(true);
              }}
            >
              {t("posts.create")}
            </Button>
          </div>

          {isLoadingPosts ? (
            <div className="flex justify-center p-8">{t("loading.posts")}</div>
          ) : (
            <>
              <UserPostsGrid
                posts={postsResponse?.data}
                openEditModal={openEditModal}
                setPostToDelete={setPostToDelete}
                isDeletePending={deletePostMutation.isPending}
              />

              {postsResponse?.meta && postsResponse.meta.total > 0 && (
                <div className="mt-4">
                  <Paginator
                    currentPage={postsResponse.meta.page}
                    totalPages={postsResponse.meta.lastPage}
                    pageSize={postsResponse.meta.limit}
                    pageSizes={[3, 6, 12, 18]}
                    onPageChange={setPostsPage}
                    onPageSizeChange={(size) => {
                      setPostsLimit(size);
                      setPostsPage(1);
                    }}
                  />
                </div>
              )}
            </>
          )}

          <PostDialog
            isOpen={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            form={form}
            onSubmit={onSubmitCreate}
            isPending={createPostMutation.isPending}
            mode="create"
          />

          <PostDialog
            isOpen={isEditOpen}
            onOpenChange={setIsEditOpen}
            form={form}
            onSubmit={onSubmitUpdate}
            isPending={updatePostMutation.isPending}
            mode="edit"
          />

          <DeletePostAlertDialog
            postToDelete={postToDelete}
            setPostToDelete={setPostToDelete}
            onConfirm={() => {
              if (postToDelete !== null) {
                deletePostMutation.mutate(postToDelete);
              }
              setPostToDelete(null);
            }}
          />

          <EditProfileDialog
            isOpen={isEditProfileOpen}
            onOpenChange={setIsEditProfileOpen}
            form={profileForm}
            onSubmit={onSubmitProfileUpdate}
            isPending={updateProfileMutation.isPending}
          />
        </div>
      </main>
    </div>
  );
}
