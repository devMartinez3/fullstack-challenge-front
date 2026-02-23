"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/components/DataTable";
import { Paginator } from "@/components/Paginator";
import { type UseMutationResult } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/users.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface UserData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: string;
  _count?: { posts: number };
}

interface UserTableProps {
  users: UserData[];
  isLoading: boolean;
  deleteMutation: UseMutationResult<
    any,
    any,
    { id: number; adminId: number },
    unknown
  >;
  setUserToDelete: (id: number) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  usersResponse: {
    meta?: { page: number; limit: number; lastPage: number };
  } | null;
}

export default function UserTable({
  users,
  isLoading,
  deleteMutation,
  setUserToDelete,
  setPage,
  setLimit,
  usersResponse,
}: UserTableProps) {
  const { user: authUser } = useAuthStore();
  const queryClient = useQueryClient();

  const updateRoleMutation = useMutation({
    mutationFn: ({
      id,
      role,
      adminId,
    }: {
      id: number;
      role: "USER" | "ADMIN";
      adminId: number;
    }) => usersService.updateUserRole(id, role, adminId),
    onSuccess: () => {
      toast.success("Rol actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // If the admin is on a detail page, invalidate that too just in case
      // queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Error al actualizar el rol",
      );
    },
  });

  return (
    <>
      <DataTable
        data={users}
        columns={[
          {
            header: "Avatar",
            className: "w-[80px]",
            cell: (user: UserData) => (
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.firstName} />
                <AvatarFallback>
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>
            ),
          },
          {
            header: "ReqRes ID",
            accessorKey: "id",
            className: "font-medium",
          },
          {
            header: "Email",
            accessorKey: "email",
          },
          {
            header: "Name",
            cell: (user: UserData) => `${user.firstName} ${user.lastName}`,
          },
          {
            header: "Posts",
            className: "text-end",
            cell: (user: UserData) => user._count?.posts || 0,
          },
          {
            header: "Role",
            className: "text-end",
            cell: (user: UserData) => {
              const isAdmin = authUser?.role === "ADMIN";
              const isPending =
                updateRoleMutation.isPending &&
                updateRoleMutation.variables?.id === user.id;

              const handleRoleToggle = () => {
                if (!isAdmin || !authUser || isPending) return;
                const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
                updateRoleMutation.mutate({
                  id: user.id,
                  role: newRole,
                  adminId: authUser.id,
                });
              };

              if (isAdmin) {
                return (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRoleToggle}
                    disabled={isPending}
                    className={`relative inline-flex items-center justify-center lowercase text-[14px] border rounded-full px-2 py-1 transition-colors min-w-[70px] ${
                      user.role === "ADMIN"
                        ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 cursor-pointer"
                        : "border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 cursor-pointer"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <AnimatePresence mode="popLayout" initial={false}>
                      {isPending ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          className="absolute"
                        >
                          <Loader2 className="w-3 h-3 animate-spin" />
                        </motion.div>
                      ) : (
                        <motion.span
                          key={user.role}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {user.role}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              }

              return (
                <span className="lowercase text-[14px] border border-indigo-500 rounded-full px-2 py-1 min-w-[70px] inline-block text-center">
                  {user.role}
                </span>
              );
            },
          },
          {
            header: "Actions",
            className: "text-right",
            cell: (user: UserData) => {
              const isAdmin = authUser?.role === "ADMIN";

              return (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/users/${user.id}`}>
                        View Details & Posts
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 cursor-pointer"
                          onClick={() => setUserToDelete(user.id)}
                          disabled={deleteMutation.isPending}
                        >
                          Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            },
          },
        ]}
        isLoading={isLoading}
        emptyMessage="No users found. Import one to get started!"
        keyExtractor={(item: UserData) => item.id.toString()}
      />

      {usersResponse?.meta && (
        <Paginator
          currentPage={usersResponse.meta.page}
          totalPages={usersResponse.meta.lastPage}
          pageSize={usersResponse.meta.limit}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newSize) => {
            setLimit(newSize);
            setPage(1); // Reset to first page on resize
          }}
        />
      )}
    </>
  );
}
