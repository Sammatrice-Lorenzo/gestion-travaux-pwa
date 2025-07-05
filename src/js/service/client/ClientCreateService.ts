import type Framework7 from 'framework7'
import type { ClientFormInteface } from '../../../intefaces/Client/ClientFormInteface'
import type { FormPageInteface } from '../../../intefaces/FormPageInteface'
import { createClient } from '../../client/client'
import { handleSubmitForm } from '../form/formErrorInputs'
import { clientSchema } from '../schema/client/clientSchema'

export default class ClientCreateService implements FormPageInteface {
  constructor(
    private _app: Framework7,
    private _selectorForm: string,
  ) {}

  public getPageTitle(): string {
    return 'Nouveau client'
  }

  public getBlockTitle(): string {
    return "Création d'un client"
  }

  public initForm(): void {
    this._app.form.removeFormData(`#${this._selectorForm}`)
  }

  public async send(): Promise<void> {
    const formData = this._app.form.convertToData(
      `#${this._selectorForm}`,
    ) as ClientFormInteface

    if (!handleSubmitForm(formData, clientSchema, this._selectorForm)) {
      return
    }

    await createClient(formData, this._app)
  }
}
