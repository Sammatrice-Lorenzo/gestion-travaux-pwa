import { z } from 'zod'
import dateSchema from '../dateSchema'

/**
 * PDF ou photo d'un ticket : l'API convertit les photos en PDF.
 */
export const PRODUCT_INVOICE_FILE_TYPES: readonly string[] = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
]

export const formProductInvoiceFilesSchema = z.object({
  date: dateSchema,
  files: z
    .array(z.custom<File>((file) => file instanceof File))
    .min(1, { message: 'Veuillez sélectionner au moins un fichier !' })
    .refine(
      (files) =>
        files.every((file) => PRODUCT_INVOICE_FILE_TYPES.includes(file.type)),
      {
        message:
          'Seuls les fichiers PDF et les photos (JPEG, PNG, WebP) sont acceptés.',
      },
    ),
})
