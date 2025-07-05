import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().nonempty({ message: "L'email ne doit pas être vide" }),
  password: z
    .string()
    .nonempty({ message: 'Le mot de passe ne doit pas être vide' }),
})
