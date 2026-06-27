import type Framework7 from 'framework7'
import type SupplierInterface from '../../../intefaces/Supplier/SupplierInterface'
import type SupplierReadInterface from '../../../intefaces/Supplier/SupplierReadInterface'
import type SupplierReturnInvoiceInterface from '../../../intefaces/SupplierReturn/SupplierReturnInvoiceInterface'
import type SupplierReturnUpdateFormInterface from '../../../intefaces/SupplierReturn/SupplierReturnUpdateFormInterface'
import { createPopup } from '../../components/popupSupplierReturn'
import supplierReturnInvoiceStore from '../../store/supplierReturnInvoiceStore'
import { updateSupplierReturnInvoice } from '../../supplierReturnInvoice.ts'
import { handleSubmitForm } from '../form/formErrorInputs'
import { formSupplierReturnUpdateSchema } from '../schema/supplierReturn/formSupplierReturnUpdateSchema'

export default class SupplierReturnFormService {
  constructor(private onUpdated?: () => void) {}

  public handleOpenPopupEditSupplierReturnFile(
    app: Framework7,
    invoice: SupplierReturnInvoiceInterface,
    suppliers: SupplierInterface[],
  ): void {
    const dateInvoice = new Date(invoice.date)
    const formattedDate = dateInvoice.toISOString().slice(0, 10)

    const supplier: SupplierReadInterface | null | undefined = invoice.supplier
    const formPopup: SupplierReturnUpdateFormInterface = {
      id: invoice.id.toString(),
      name: invoice.name,
      date: formattedDate,
      'credit-amount': invoice.creditAmount,
      supplier: supplier?.id?.toString(),
    }

    const popupEdit = createPopup(
      app,
      formPopup,
      this.handleSupplierReturnUpdate.bind(this, suppliers),
      suppliers,
    )
    popupEdit.open()
  }

  private async handleSupplierReturnUpdate(
    suppliers: SupplierInterface[],
    $f7: Framework7,
    formSupplierReturn: SupplierReturnUpdateFormInterface,
    idForm: string,
  ): Promise<void> {
    const formData = $f7.form.convertToData(`#${idForm}`)
    if (!handleSubmitForm(formData, formSupplierReturnUpdateSchema, idForm)) {
      return
    }

    await updateSupplierReturnInvoice($f7, formSupplierReturn.id, formData)
    $f7.popup.close()

    const invoice: SupplierReturnInvoiceInterface =
      supplierReturnInvoiceStore.getters.getInvoiceById.value(
        Number.parseInt(formSupplierReturn.id),
      )

    const supplierId = formData.supplier
      ? Number.parseInt(formData.supplier)
      : null
    const supplierName = suppliers.find((s) => s.id === supplierId)?.name ?? ''

    const updatedInvoice: SupplierReturnInvoiceInterface = {
      id: invoice.id,
      name: formData.name,
      path: invoice.path,
      date: formData.date,
      creditAmount: formData['credit-amount'],
      supplier: supplierId ? { id: supplierId, name: supplierName } : null,
      linkedProductInvoice: invoice.linkedProductInvoice,
    }

    supplierReturnInvoiceStore.dispatch('updateInvoice', updatedInvoice)
    this.onUpdated?.()
  }
}
