import { z } from 'zod'

const dateSchema = z
  .union([z.string(), z.date()])
  .transform((val) => {
    return typeof val === 'string' ? new Date(val) : val
  })
  .refine((date): date is Date => date !== null, {
    message: 'Date invalide',
  })

export default dateSchema
