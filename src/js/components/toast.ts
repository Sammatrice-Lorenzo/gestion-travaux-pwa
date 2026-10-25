import type Framework7 from 'framework7'

interface ToastStyle {
  icon: string
  cssClass: string
  closeTimeout: number
}

/**
 * Toast centré commun à toute l'application : toastError et toastSuccess n'en changent que le style.
 */
const createToast = (app: Framework7, text: string, style: ToastStyle) => {
  app.toast
    .create({
      text: text,
      icon: `<i class="f7-icons">${style.icon}</i>`,
      cssClass: style.cssClass,
      position: 'center',
      closeTimeout: style.closeTimeout,
    })
    .open()
}

export default createToast
