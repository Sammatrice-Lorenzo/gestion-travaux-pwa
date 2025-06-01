import type Framework7 from 'framework7'
import type { ClientFormInteface } from '../../../intefaces/Client/ClientFormInteface'
import type { ClientInterface } from '../../../intefaces/Client/ClientInterface'
import type { FormPageInteface } from '../../../intefaces/FormPageInteface'
import { findClientById, updateClient } from '../../client/client'
import { handleSubmitForm } from '../form/formErrorInputs'
import { clientSchema } from './clientSchema'

export default class ClientUpdateService implements FormPageInteface {
  constructor(
    private _app: Framework7,
    private clientId: number,
    private _selectorForm: string,
  ) {}

  public getPageTitle(): string {
    return 'Modification prestation'
  }

  public getBlockTitle(): string {
    return 'Modification informations'
  }

  public async initForm(): Promise<void> {
    const client = (await findClientById(
      this.clientId,
      this._app,
    )) as ClientInterface
    const formClient: ClientFormInteface = {
      firstname: client.firstname,
      lastname: client.lastname,
      city: client.city,
      phoneNumber: client.phoneNumber.replace(/\./g, ''),
      postalCode: client.postalCode,
      streetAddress: client.streetAddress,
      email: client.email,
    }

    this._app.form.fillFromData(`#${this._selectorForm}`, formClient)
  }

  public send(): void {
    const formData = this._app.form.convertToData(
      `#${this._selectorForm}`,
    ) as ClientFormInteface
    if (!handleSubmitForm(formData, clientSchema, this._selectorForm)) {
      return
    }

    updateClient(formData, this.clientId, this._app)
  }
}
