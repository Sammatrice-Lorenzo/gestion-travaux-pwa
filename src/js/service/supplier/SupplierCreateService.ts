import type Framework7 from 'framework7'
import type { FormPageInteface } from '../../../intefaces/FormPageInteface'
import type SupplierInterface from '../../../intefaces/Supplier/SupplierInterface'
import type Supplier from '../../Supplier'
import { handleSubmitForm } from '../form/formErrorInputs'
import { supplierSchema } from '../schema/supplier/supplierSchema'

export default class SupplierCreateService implements FormPageInteface {
  constructor(
    private _app: Framework7,
    private _supplierManager: Supplier,
    private _selectorForm: string,
  ) {}

  public getPageTitle(): string {
    return 'Nouveau fournisseur'
  }

  public getBlockTitle(): string {
    return "Création d'un fournisseur"
  }

  public initForm(): void {
    this._app.form.removeFormData(`#${this._selectorForm}`)
  }

  public async send(): Promise<void> {
    const formData = this._app.form.convertToData(
      `#${this._selectorForm}`,
    ) as SupplierInterface

    if (!handleSubmitForm(formData, supplierSchema, this._selectorForm)) {
      return
    }

    await this._supplierManager.createSupplier(formData)
  }
}
