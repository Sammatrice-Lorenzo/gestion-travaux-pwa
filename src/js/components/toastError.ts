import type Framework7 from 'framework7'
import createToast from './toast'

const toastError = (app: Framework7, text: string) => {
  createToast(app, text, {
    icon: 'exclamationmark_triangle_fill',
    cssClass: 'bg-color-red text-color-white',
    closeTimeout: 2000,
  })
}

export default toastError
