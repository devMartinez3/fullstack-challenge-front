import { z } from "zod";

export const getProfileSchema = (t: any) =>
  z.object({
    firstName: z.string().min(2, {
      message: t("editProfileDialog.validation.firstNameMin"),
    }),
    lastName: z.string().min(2, {
      message: t("editProfileDialog.validation.lastNameMin"),
    }),
    email: z.string().email({
      message: t("editProfileDialog.validation.emailInvalid"),
    }),
    avatar: z.string().url({
      message: t("editProfileDialog.validation.urlInvalid"),
    }),
  });

// For type inference, we can use a dummy schema
const dummySchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  avatar: z.string(),
});

export type ProfileFormValues = z.infer<typeof dummySchema>;
