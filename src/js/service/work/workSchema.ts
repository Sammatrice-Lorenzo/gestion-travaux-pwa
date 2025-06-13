import { z } from 'zod'
import { ProgressionEnum } from '../../enum/ProgressionEnum'

const dateField = z
  .union([z.string(), z.date()])
  .transform((val) => {
    const dateObj = typeof val === 'string' ? new Date(val) : val
    return Number.isNaN(dateObj.getTime()) ? null : dateObj
  })
  .refine((date): date is Date => date !== null, {
    message: 'Date invalide',
  })

export const formWorkSchema = z
  .object({
    name: z.string().min(1, 'Le nom est requis'),
    city: z.string().min(1, 'Veuillez saisir le nom de la ville'),
    client: z.string().min(1, 'Veuillez rajouter un client'),
    progression: z.enum([
      ProgressionEnum.NOT_STARTED,
      ProgressionEnum.IN_PROGRESS,
      ProgressionEnum.DONE,
    ]),
    start: dateField,
    end: dateField,
    equipements: z
      .array(z.string().min(1, 'Veuillez saisir une ressource'))
      .min(1, 'Veuillez saisir au moins une ressource'),
    totalAmount: z.preprocess(
      (val) => (typeof val === 'string' ? Number.parseFloat(val) : val),
      z.number().min(1, 'Montant invalide'),
    ),
  })
  .refine((data) => data.end > data.start, {
    message: 'La date de fin doit être postérieure à la date de début',
    path: ['end'],
  })
