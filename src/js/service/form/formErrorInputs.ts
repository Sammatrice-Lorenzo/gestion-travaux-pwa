import type Framework7 from 'framework7'
import type { ZodSchema } from 'zod'

const ERROR_CLASS_INPUT: string = 'item-input-error-message'

const addBoxError = (input: Element, text: string): void => {
  const errorBox = document.createElement('div')
  errorBox.className = ERROR_CLASS_INPUT
  errorBox.innerText = text

  const wrap = input.closest('.item-input-wrap')
  if (
    !wrap?.querySelector('.input-error-message') ||
    !wrap.querySelector(`.${ERROR_CLASS_INPUT}`)
  ) {
    wrap?.appendChild(errorBox)
  }
}

const removeClassErrorInInputs = (form: HTMLElement): void => {
  for (const div of form.querySelectorAll('.item-input-error-message')) {
    div.remove()
  }
}

const handleSubmitForm = (
  formData: unknown,
  schema: ZodSchema,
  idForm: string,
): boolean => {
  const form: HTMLElement = document.getElementById(idForm) as HTMLElement
  const result = schema.safeParse(formData)

  removeClassErrorInInputs(form)
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    for (const field in errors) {
      const input: Element | null = form.querySelector(`[name="${field}"]`)
      const itemContent: HTMLElement | null | undefined =
        input?.parentElement?.parentElement?.parentElement
      if (input && itemContent) {
        itemContent.classList.add(
          'item-content',
          'item-input',
          'item-input-with-error-message',
          'item-input-invalid',
        )
        input.classList.add('input-invalid')

        const text = errors[field]
        addBoxError(input, text ? text[0] : '')
      }
    }

    return false
  }

  return true
}

const handleSubmitFormInputFiles = (
  formData: unknown,
  schema: ZodSchema,
  app: Framework7,
): boolean => {
  const result = schema.safeParse(formData)
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    for (const field in errors) {
      const textField = errors[field]
      const text = textField ? textField[0] : ''
      app.toast
        .create({
          text: text,
          icon: '<i class="f7-icons">exclamationmark_triangle_fill</i>',
          cssClass: 'bg-color-red text-color-white',
          position: 'center',
          closeTimeout: 2000,
        })
        .open()
    }

    return false
  }

  return true
}

export { handleSubmitForm, handleSubmitFormInputFiles }
