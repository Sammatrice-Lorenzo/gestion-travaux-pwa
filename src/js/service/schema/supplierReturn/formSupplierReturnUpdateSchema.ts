import { z } from 'zod'
import dateSchema from '../dateSchema'

export const formSupplierReturnUpdateSchema = z.object({
  name: z.string().min(1, 'Le titre est requis'),
  date: dateSchema,
  'credit-amount': z.preprocess(
    (val) => (typeof val === 'string' ? Number.parseFloat(val) : val),
    z.number().min(0, 'Montant invalide'),
  ),
  supplier: z.string().nullable().optional(),
})
