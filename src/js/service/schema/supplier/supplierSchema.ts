import { z } from 'zod'

const phoneRegex: RegExp =
  /^(?:(?:\+|00)\d{1,3}[\s.-]?)?(?:\(?\d+\)?[\s.-]?){5,}$/

export const supplierSchema = z.object({
  id: z.number().nullable().optional(),

  name: z
    .string()
    .min(1, { message: 'Le nom du fournisseur est obligatoire.' }),

  address: z.string().min(1, { message: "L'adresse est obligatoire." }),

  city: z.string().min(1, { message: 'La ville est obligatoire.' }),

  country: z.string().min(1, { message: 'Le pays est obligatoire.' }),

  phone: z
    .string()
    .regex(phoneRegex, { message: 'Numéro de téléphone invalide.' })
    .nullable()
    .optional(),

  vatNumber: z
    .string()
    .max(50, {
      message: 'Le numéro de TVA ne doit pas dépasser 50 caractères.',
    })
    .nullable()
    .optional(),
})

export type Supplier = z.infer<typeof supplierSchema>
