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
    element: Event,
  ): void {
    const currentTarget = app.$(element.currentTarget)
    const dateInvoice = new Date(currentTarget.data('date'))
    const formattedDate = dateInvoice.toISOString().slice(0, 10)

    const formPopup: ProductInvoiceUpdateFormInterface = {
      id: currentTarget.attr('id'),
      name: currentTarget.data('name'),
      date: formattedDate,
      'total-amount': currentTarget.data('total-amount'),
    }
    const popupEdit = createPopup(
      app,
      formPopup,
      this.handleProductInvoiceUpdate,
    )
    popupEdit.open()
  }

  private handleProductInvoiceUpdate(
    $f7: Framework7,
    formProductInvoice: ProductInvoiceUpdateFormInterface,
    idForm: string,
  ): void {
    const formData = $f7.form.convertToData(`#${idForm}`)
    if (!handleSubmitForm(formData, formProductInvoiceUpdateSchema, idForm)) {
      return
    }

    updateProductInvoice($f7, formProductInvoice.id, formData)
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
