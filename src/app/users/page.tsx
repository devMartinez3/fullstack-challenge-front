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

export default function UsersPage() {
  const queryClient = useQueryClient();
  const { user: authUser } = useAuthStore();
  const [importId, setImportId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: usersResponse, isLoading } = useQuery({
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
      toast.success("Usuario importado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsDialogOpen(false);
      setImportId("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al importar usuario");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: usersService.deleteUser,
    onSuccess: () => {
      toast.success("Usuario descartado");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al eliminar usuario");
    },
  });

  const handleImport = () => {
    const id = parseInt(importId, 10);
    if (isNaN(id)) {
      toast.error("Por favor, ingresa un ID válido");
      return;
    }
    importMutation.mutate(id);
  };

  return (
    <>
      <div className="flex min-h-screen flex-col bg-gray-50/50 dark:bg-background">
        <Header title="User Dashboard" />
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-6xl space-y-4">
            <div className="flex flex-col items-start gap-1">
              <h2 className="text-2xl font-bold tracking-tight">Users</h2>
              <p className="text-sm text-muted-foreground">
                These users are saved in the local database. You can import new
                users from ReqRes using the button below.
              </p>
            </div>

            <div className="flex flex-col gap-2 md:flex-row justify-center md:justify-between">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, correo o ReqRes ID..."
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
                Import User from ReqRes
              </Button>
            </div>

            <UserTable
              users={filteredUsers}
              isLoading={isLoading}
              deleteMutation={deleteMutation}
              setUserToDelete={setUserToDelete}
              setPage={setPage}
              setLimit={setLimit}
              usersResponse={usersResponse}
            />
          </div>
        </main>
      </div>

      {/* Dialog to import user */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Import User</DialogTitle>
            <DialogDescription>
              Enter the ReqRes User ID you wish to import into the local
              database.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="userId"
                className="text-right text-sm font-medium"
              >
                User ID
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
              {importMutation.isPending ? "Importing..." : "Import"}
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
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (userToDelete !== null && authUser?.id) {
                  deleteMutation.mutate({
                    id: userToDelete,
                    adminId: authUser.id,
                  });
                } else if (!authUser?.id) {
                  toast.error("Sesión inválida, inténtalo de nuevo.");
                }
                setUserToDelete(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
