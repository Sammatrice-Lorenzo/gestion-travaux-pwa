import { z } from 'zod'

export const FormWorkEventDaySchema = z.object({
  startHours: z.string().min(1, { message: "L'heure de début est requise." }),
  endHours: z.string().min(1, { message: "L'heure de fin est requise." }),
  title: z.string().min(1, { message: 'Le titre est requis.' }),
  color: z.string().min(1, { message: 'La couleur est requise.' }),
})

export type FormWorkEventDayType = z.infer<typeof FormWorkEventDaySchema>
