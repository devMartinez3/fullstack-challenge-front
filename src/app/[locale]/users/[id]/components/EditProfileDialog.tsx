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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import type { ProfileFormValues } from "@/schemas/profile.schema";
import { useTranslations } from "next-intl";

interface EditProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<ProfileFormValues>;
  onSubmit: (data: ProfileFormValues) => void;
  isPending: boolean;
}

export function EditProfileDialog({
  isOpen,
  onOpenChange,
  form,
  onSubmit,
  isPending,
}: EditProfileDialogProps) {
  const t = useTranslations("editProfileDialog");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.firstNameLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.firstNamePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.lastNameLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.lastNamePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.emailLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.emailPlaceholder")}
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.avatarLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.avatarPlaceholder")}
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? t("actions.saving") : t("actions.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
