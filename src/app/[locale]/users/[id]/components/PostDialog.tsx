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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("postDialog");
  const isCreate = mode === "create";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isCreate ? t("title.create") : t("title.edit")}
          </DialogTitle>
          <DialogHeader>
            <DialogDescription>
              {isCreate ? t("description.create") : t("description.edit")}
            </DialogDescription>
          </DialogHeader>
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
                  <FormLabel>{t("form.titleLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.titlePlaceholder")}
                      {...field}
                    />
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
                  <FormLabel>{t("form.contentLabel")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder={t("form.contentPlaceholder")}
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
                        {t("form.counter", { count: field.value?.length || 0 })}
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
                    ? t("actions.creating")
                    : t("actions.create")
                  : isPending
                    ? t("actions.saving")
                    : t("actions.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
