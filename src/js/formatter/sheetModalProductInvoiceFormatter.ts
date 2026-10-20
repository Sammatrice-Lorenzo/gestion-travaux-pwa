import type SheetModalInterface from '../../intefaces/SheetModalInterface'
import { PRODUCT_INVOICE_FILE_TYPES } from '../service/schema/productInvoice/formProductInvoiceFilesSchema'

const sheetModalProductInvoiceFormatter: SheetModalInterface = {
  title: 'Insérer les factures',
  formId: 'form-product-invoices',
  inputId: 'files',
  captureInputId: 'files-photo',
  nameInput: 'files[]',
  acceptFiles: PRODUCT_INVOICE_FILE_TYPES.join(','),
  fileHint: 'Appuyez pour choisir des PDF ou des photos',
  description:
    'Sélectionnez les factures à uploader (plusieurs PDF ou photos à la fois), ou prenez un ticket en photo : il sera enregistré en PDF.',
}

export default sheetModalProductInvoiceFormatter
