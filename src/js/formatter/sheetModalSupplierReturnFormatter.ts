import type SheetModalInterface from '../../intefaces/SheetModalInterface'

const sheetModalSupplierReturnFormatter: SheetModalInterface = {
  title: 'Importer un avoir / retour',
  formId: 'form-supplier-return',
  inputId: 'return-files',
  nameInput: 'files[]',
  acceptFiles: 'application/pdf',
  description:
    'Sélectionnez vos notes de crédit ou bons de retour (PDF). Vous pouvez en choisir plusieurs à la fois.',
}

export default sheetModalSupplierReturnFormatter
