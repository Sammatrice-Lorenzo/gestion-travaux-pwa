import type Framework7 from 'framework7'
import type { FormPageInteface } from '../../../intefaces/FormPageInteface'
import type SupplierInterface from '../../../intefaces/Supplier/SupplierInterface'
import type Supplier from '../../Supplier'
import { handleSubmitForm } from '../form/formErrorInputs'
import { supplierSchema } from '../schema/supplier/supplierSchema'

export default class SupplierUpdateService implements FormPageInteface {
  constructor(
    private _app: Framework7,
    private _supplierId: number,
    private _supplierManager: Supplier,
    private _selectorForm: string,
  ) {}

  public getPageTitle(): string {
    return 'Modification forunisseur'
  }

  public getBlockTitle(): string {
    return 'Modification informations'
  }

  public async initForm(): Promise<void> {
    const client = (await this._supplierManager.findSupplier(
      this._supplierId,
    )) as SupplierInterface
    const formSupplier: SupplierInterface = {
      name: client.name,
      address: client.address,
      city: client.city,
      phone: client.phone,
      country: client.country,
      vatNumber: client.vatNumber,
    }

    this._app.form.fillFromData(`#${this._selectorForm}`, formSupplier)
  }

  public async send(): Promise<void> {
    const formData = this._app.form.convertToData(
      `#${this._selectorForm}`,
    ) as SupplierInterface
    if (!handleSubmitForm(formData, supplierSchema, this._selectorForm)) {
      return
    }

    await this._supplierManager.updateSupplier(formData, this._supplierId)
  }
}
