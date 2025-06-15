import type SheetModalInterface from '../../intefaces/SheetModalInterface'

const sheetModalWorkImageFormatter: SheetModalInterface = {
  title: 'Insérer les images',
  formId: 'form-work-images',
  inputId: 'images',
  nameInput: 'images[]',
  acceptFiles: 'image/png, image/gif, image/jpeg, image/jpg',
  description:
    'Veuillez séléctionner les images que vous souhaitez uploader. Vous pouvez sélectionner plusieurs images à la fois.',
}

export default sheetModalWorkImageFormatter
