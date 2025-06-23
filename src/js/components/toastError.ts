import type Framework7 from 'framework7'

const toastError = (app: Framework7, text: string) => {
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

export default toastError
