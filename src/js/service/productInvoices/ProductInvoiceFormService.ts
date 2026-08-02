import type Framework7 from 'framework7'
import type ProductInvoiceInterface from '../../../intefaces/ProductInvoice/ProductInvoiceInterface'
import type ProductInvoiceUpdateFormInterface from '../../../intefaces/ProductInvoice/ProductInvoiceUpdateFormInterface'
import type SupplierInterface from '../../../intefaces/Supplier/SupplierInterface'
import type SupplierReadInterface from '../../../intefaces/Supplier/SupplierReadInterface'
import { createPopup } from '../../components/popupProductInvoice'
import { updateProductInvoice } from '../../productInvoice'
import productInvoiceStore from '../../store/productInvoiceStore'
import { handleSubmitForm } from '../form/formErrorInputs'
import { formProductInvoiceUpdateSchema } from '../schema/productInvoice/formProductInvoiceUpdateSchema'

export default class ProductInvoiceFormService {
  public handleOpenPopupEditProductInvoiceFile(
    app: Framework7,
    productInvoice: ProductInvoiceInterface,
    suppliers: SupplierInterface[],
  ): void {
    const dateInvoice = new Date(productInvoice.date)
    const formattedDate = dateInvoice.toISOString().slice(0, 10)

    const supplier: SupplierReadInterface | null | undefined =
      productInvoice.supplier
    const formPopup: ProductInvoiceUpdateFormInterface = {
      id: productInvoice.id.toString(),
      name: productInvoice.name,
      date: formattedDate,
      'total-amount': productInvoice.totalAmount,
      supplier: supplier?.id?.toString(),
    }

    const popupEdit = createPopup(
      app,
      formPopup,
      this.handleProductInvoiceUpdate,
      suppliers,
    )
    popupEdit.open()
  }

  private async handleProductInvoiceUpdate(
    $f7: Framework7,
    formProductInvoice: ProductInvoiceUpdateFormInterface,
    idForm: string,
  ): Promise<void> {
    const formData = $f7.form.convertToData(`#${idForm}`)
    if (!handleSubmitForm(formData, formProductInvoiceUpdateSchema, idForm)) {
      return
    }

    await updateProductInvoice($f7, formProductInvoice.id, formData)
    $f7.popup.close()

    const productInvoice: ProductInvoiceInterface =
      productInvoiceStore.getters.getInvoiceById.value(
        Number.parseInt(formProductInvoice.id),
      )

    const updatedInvoice: ProductInvoiceInterface = {
      id: productInvoice.id,
      name: formProductInvoice.name,
      path: productInvoice.path,
      date: formProductInvoice.date,
      totalAmount: formProductInvoice['total-amount'],
      supplier: {
        id: formProductInvoice.supplier
          ? Number.parseInt(formProductInvoice.supplier)
          : null,
        name: '',
      },
      linkedSupplierReturns: productInvoice.linkedSupplierReturns,
    }
    productInvoiceStore.dispatch('updateInvoice', updatedInvoice)
  }
}
