"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/users.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search } from "lucide-react";
import { Header } from "@/components/Header";
import UserTable from "./components/UserTable";
import { useAuthStore } from "@/store/authStore";
import { UserData } from "@/types/users";
import { Meta } from "@/types/common";
import { useTranslations } from "next-intl";

export default function UsersPage() {
  const t = useTranslations("user");
  const queryClient = useQueryClient();
  const { user: authUser } = useAuthStore();
  const [importId, setImportId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: usersResponse, isLoading } = useQuery<{
    data: UserData[];
    meta: Meta;
  }>({
    queryKey: ["users", page, limit],
    queryFn: () => usersService.getSavedUsers(page, limit),
  });

  // Client-side filtering
  const filteredUsers = useMemo(() => {
    const data = usersResponse?.data;
    if (!data) return [];
    if (!searchTerm.trim()) return data;

    const lowerCaseSearch = searchTerm.toLowerCase();

    return data.filter((user: any) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const email = user.email.toLowerCase();
      const idStr = user.id.toString();

      return (
        fullName.includes(lowerCaseSearch) ||
        email.includes(lowerCaseSearch) ||
        idStr.includes(lowerCaseSearch)
      );
    });
  }, [usersResponse, searchTerm]);

  // Import user mutation
  const importMutation = useMutation({
    mutationFn: usersService.importUser,
    onSuccess: () => {
      toast.success(t("toasts.importSuccess"));
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsDialogOpen(false);
      setImportId("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t("toasts.importError"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: usersService.deleteUser,
    onSuccess: () => {
      toast.success(t("toasts.deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t("toasts.deleteError"));
    },
  });

  const handleImport = () => {
    const id = parseInt(importId, 10);
    if (isNaN(id)) {
      toast.error(t("toasts.importError"));
      return;
    }
    importMutation.mutate(id);
  };

  return (
    <>
      <div className="flex min-h-screen flex-col bg-gray-50/50 dark:bg-background">
        <Header title={t("dashboard.headerTitle")} />
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-6xl space-y-4">
            <div className="flex flex-col items-start gap-1">
              <h2 className="text-2xl font-bold tracking-tight">
                {t("dashboard.title")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("dashboard.description")}
              </p>
            </div>

            <div className="flex flex-col gap-2 md:flex-row justify-center md:justify-between">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("search.placeholder")}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1); // Reset to first page when searching
                  }}
                  className="pl-9 w-full sm:w-[350px]"
                />
              </div>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="w-full sm:w-auto"
              >
                {t("actions.importFromReqRes")}
              </Button>
            </div>

            <UserTable
              metaResp={usersResponse?.meta}
              usersResponse={filteredUsers}
              isLoading={isLoading}
              deleteMutation={deleteMutation}
              setUserToDelete={setUserToDelete}
              setPage={setPage}
              setLimit={setLimit}
            />
          </div>
        </main>
      </div>

      {/* Dialog to import user */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("importDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("importDialog.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="userId"
                className="text-right text-sm font-medium"
              >
                {t("importDialog.userIdLabel")}
              </label>
              <Input
                id="userId"
                type="number"
                value={importId}
                onChange={(e) => setImportId(e.target.value)}
                className="col-span-3"
                placeholder="e.g. 1, 2, 3..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleImport}
              disabled={importMutation.isPending || !importId}
            >
              {importMutation.isPending
                ? t("actions.importing")
                : t("actions.import")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert dialog to delete user */}
      <AlertDialog
        open={userToDelete !== null}
        onOpenChange={(open: boolean) => !open && setUserToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDialog.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("actions.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (userToDelete !== null && authUser?.id) {
                  deleteMutation.mutate({
                    id: userToDelete,
                    adminId: authUser.id,
                  });
                } else if (!authUser?.id) {
                  toast.error(t("toasts.invalidSession"));
                }
                setUserToDelete(null);
              }}
            >
              {t("actions.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
