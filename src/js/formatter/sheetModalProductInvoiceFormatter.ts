import type SheetModalInterface from '../../intefaces/SheetModalInterface'

const sheetModalProductInvoiceFormatter: SheetModalInterface = {
  title: 'Insérer les factures',
  formId: 'form-product-invoices',
  inputId: 'files',
  nameInput: 'files[]',
  acceptFiles: 'application/pdf',
  description:
    'Veuillez séléctionner les factures que vous souhaitez uploader. Vous pouvez sélectionner plusieurs fichiers PDF à la fois.',
}

export default sheetModalProductInvoiceFormatter
