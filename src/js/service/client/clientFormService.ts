import { z } from 'zod'

const regexPhoneNumber: RegExp = /^(0|\+33|0033)[1-9](\d{2}){4}$/
const regexPostalCode: RegExp = /^\d{5}$/

const ERROR_CLASS_INPUT: string = 'item-input-error-message'

const clientSchema = z.object({
  firstname: z.string().min(1, 'Veuillez saisir un prénom'),
  lastname: z.string().min(1, 'Veuillez saisir un nom'),
  streetAddress: z.string().min(1, 'Veuillez saisir le nom de la rue'),
  city: z.string().min(1, 'Veuillez saisir le nom de la ville'),
  postalCode: z.string().min(1, 'Veuillez saisir le code postal').regex(regexPostalCode, 'Veuillez saisir un code postal valide'),
  phoneNumber: z.string().min(1, 'Veuillez saisir le numéro de téléphone').regex(regexPhoneNumber, 'Veuillez saisir un numéro valide'),
  email: z.string().min(1, 'Veuillez saisir l`\'email ').email('Veuillez saisir un email valide !')
})

const addBoxError = (input: Element, text: string): void => {
  const errorBox = document.createElement('div')
  errorBox.className = ERROR_CLASS_INPUT
  errorBox.innerText = text

  const wrap = input.closest('.item-input-wrap')
  if (!wrap?.querySelector('.input-error-message') || !wrap.querySelector(`.${ERROR_CLASS_INPUT}`)) {
    wrap?.appendChild(errorBox)
  }
}

const removeClassErrorInInputs = (form: HTMLElement): void => {
  for (const input of form.querySelectorAll('input')) {
    input.classList.remove('input-invalid')
  }
}

const handleSubmitForm = (formData: FormData): boolean => {
  const form: HTMLElement = document.getElementById('form-client') as HTMLElement
  const result = clientSchema.safeParse(formData)

  removeClassErrorInInputs(form)
  if (!result.success) {
     const errors = result.error.flatten().fieldErrors
      for (const field in errors) {
        const input: Element | null = form.querySelector(`[name="${field}"]`)
        const itemContent: HTMLElement | null | undefined = input?.parentElement?.parentElement?.parentElement
        if (input && itemContent) {
          itemContent.classList = 'item-content item-input item-input-with-error-message item-input-invalid'
          input.classList.add('input-invalid')

          addBoxError(input, errors[field][0])
        }
      }

      return false
  }

  return true
}

export {
  clientSchema,
  handleSubmitForm
}
