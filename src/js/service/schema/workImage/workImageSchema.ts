import { z } from 'zod'

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

export const workImageSchema = z.object({
  'images[]': z
    .custom<File>((file) => file instanceof File, {
      message: 'Veuillez sélectionner au moins une image !',
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Seuls les fichiers jpg, jpeg, png, webp sont acceptés.',
    }),
  workId: z.string(),
})
