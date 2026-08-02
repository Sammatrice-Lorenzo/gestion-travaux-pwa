import { z } from 'zod'

const isValidRegex = (value: string): boolean => {
  try {
    new RegExp(value)
    return true
  } catch {
    return false
  }
}

// Best-effort client-side check only: this validates JS/PCRE regex syntax for
// immediate feedback, but the backend matches against MySQL's ICU regex dialect,
// so a pattern accepted here can still be rejected server-side (surfaced via the
// existing 422 toast path).
export const workEventDaySearchSchema = z
  .object({
    client: z.string().optional(),
    search: z
      .string()
      .min(1, 'Le motif de recherche est requis')
      .max(200, 'Le motif de recherche est trop long (200 caractères maximum)')
      .refine(isValidRegex, 'Expression régulière invalide'),
    startDate: z.string().min(1, 'La date de début doit être saisie'),
    endDate: z.string().min(1, 'La date de fin doit être saisie'),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: 'La date de début doit précéder la date de fin',
    path: ['endDate'],
  })
