import type Framework7 from 'framework7'
import type ProductInvoiceInterface from '../../../intefaces/ProductInvoice/ProductInvoiceInterface'
import type ProductInvoiceUpdateFormInterface from '../../../intefaces/ProductInvoice/ProductInvoiceUpdateFormInterface'
import { createPopup } from '../../components/popupProductInvoice'
import { updateProductInvoice } from '../../productInvoice'
import productInvoiceStore from '../../store/productInvoiceStore'
import { handleSubmitForm } from '../form/formErrorInputs'
import { formProductInvoiceUpdateSchema } from './formProductInvoiceUpdateSchema'

export default class ProductInvoiceFormService {
  public handleOpenPopupEditProductInvoiceFile(
    app: Framework7,
    productInvoice: ProductInvoiceInterface,
  ): void {
    const dateInvoice = new Date(productInvoice.date)
    const formattedDate = dateInvoice.toISOString().slice(0, 10)

    const formPopup: ProductInvoiceUpdateFormInterface = {
      id: productInvoice.id.toString(),
      name: productInvoice.name,
      date: formattedDate,
      'total-amount': productInvoice.totalAmount,
    }

    const popupEdit = createPopup(
      app,
      formPopup,
      this.handleProductInvoiceUpdate,
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
    }
    productInvoiceStore.dispatch('updateInvoice', updatedInvoice)
  }
}
