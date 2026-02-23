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
import { useTranslations } from "next-intl";

interface DeletePostAlertDialogProps {
  postToDelete: string | null;
  setPostToDelete: (open: string | null) => void;
  onConfirm: () => void;
}

export function DeletePostAlertDialog({
  postToDelete,
  setPostToDelete,
  onConfirm,
}: DeletePostAlertDialogProps) {
  const t = useTranslations("deletePost");

  return (
    <AlertDialog
      open={postToDelete !== null}
      onOpenChange={(open: boolean) => !open && setPostToDelete(null)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={onConfirm}
          >
            {t("confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
