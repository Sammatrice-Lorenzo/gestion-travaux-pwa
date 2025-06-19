import { z } from 'zod'
import dateSchema from '../schema/dateSchema'

export const formProductInvoiceFilesSchema = z.object({
  date: dateSchema,
  'files[]': z
    .custom<File>((file) => file instanceof File, {
      message: 'Veuillez sélectionner au moins un fichier !',
    })
    .refine((file) => file.type === 'application/pdf', {
      message: 'Seuls les fichiers PDF sont acceptés.',
    }),
})
