import type Framework7 from 'framework7'

const toastSuccess = (app: Framework7, text: string) => {
  app.toast
    .create({
      text: text,
      icon: '<i class="f7-icons">checkmark_alt_circle_fill</i>',
      cssClass: 'bg-color-green text-color-white',
      position: 'center',
      closeTimeout: 3000,
    })
    .open()
}

export default toastSuccess
