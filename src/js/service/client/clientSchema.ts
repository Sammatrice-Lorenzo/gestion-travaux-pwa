import { z } from 'zod'

const regexPhoneNumber: RegExp = /^(0|\+33|0033)[1-9](\d{2}){4}$/
const regexPostalCode: RegExp = /^\d{5}$/

export const clientSchema = z.object({
  firstname: z.string().min(1, 'Veuillez saisir un prénom'),
  lastname: z.string().min(1, 'Veuillez saisir un nom'),
  streetAddress: z.string().min(1, 'Veuillez saisir le nom de la rue'),
  city: z.string().min(1, 'Veuillez saisir le nom de la ville'),
  postalCode: z
    .string()
    .min(1, 'Veuillez saisir le code postal')
    .regex(regexPostalCode, 'Veuillez saisir un code postal valide'),
  phoneNumber: z
    .string()
    .min(1, 'Veuillez saisir le numéro de téléphone')
    .regex(regexPhoneNumber, 'Veuillez saisir un numéro valide'),
  email: z
    .string()
    .min(1, "Veuillez saisir l'email ")
    .email('Veuillez saisir un email valide !'),
})
