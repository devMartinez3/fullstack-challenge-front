import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  lastName: z.string().min(2, {
    message: "El apellido debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Debe ser un correo electrónico válido.",
  }),
  avatar: z.string().url({
    message: "Debe ser una URL válida.",
  }),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
