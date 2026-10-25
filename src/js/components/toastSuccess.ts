import type Framework7 from 'framework7'
import createToast from './toast'

const toastSuccess = (app: Framework7, text: string) => {
  createToast(app, text, {
    icon: 'checkmark_alt_circle_fill',
    cssClass: 'bg-color-green text-color-white',
    closeTimeout: 3000,
  })
}

export default toastSuccess
