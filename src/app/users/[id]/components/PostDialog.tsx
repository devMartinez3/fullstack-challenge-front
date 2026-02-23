import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";

interface PostDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  isPending: boolean;
  mode: "create" | "edit";
}

export function PostDialog({
  isOpen,
  onOpenChange,
  form,
  onSubmit,
  isPending,
  mode,
}: PostDialogProps) {
  const isCreate = mode === "create";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isCreate ? "Crear Post" : "Editar Post"}</DialogTitle>
          <DialogDescription>
            {isCreate
              ? "Escribe un título y contenido para tu nuevo post."
              : "Modifica la información del post."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título del post..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenido</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder="Escribe el contenido aquí..."
                        className={`resize-none ${isCreate ? "h-[200px]" : "min-h-[120px]"}`}
                        rows={isCreate ? 6 : undefined}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.length > 500) {
                            return;
                          }
                          field.onChange(e);
                        }}
                      />
                      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                        {field.value?.length || 0}/500
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isCreate
                  ? isPending
                    ? "Creando..."
                    : "Crear"
                  : isPending
                    ? "Guardando..."
                    : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
