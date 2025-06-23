import { z } from 'zod'
import dateSchema from '../schema/dateSchema'

export const formProductInvoiceUpdateSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  date: dateSchema,
  'total-amount': z.preprocess(
    (val) => (typeof val === 'string' ? Number.parseFloat(val) : val),
    z.number().min(0.0, 'Montant invalide'),
  ),
})
