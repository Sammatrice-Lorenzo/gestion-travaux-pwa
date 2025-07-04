import type Framework7 from 'framework7'
import type { FormPageInteface } from '../../../intefaces/FormPageInteface'
import type WorkFormInterface from '../../../intefaces/Work/WorkFormInterface'
import { createWork } from '../../work'
import { getEquipementsInForm } from '../../work/component/btnComponent'
import { handleSubmitForm } from '../form/formErrorInputs'
import { formWorkSchema } from '../schema/work/workSchema'

export default class WorkCreateFormService implements FormPageInteface {
  constructor(
    private _app: Framework7,
    private _selectorForm: string,
  ) {}

  public getPageTitle(): string {
    return 'Nouvelle prestation'
  }

  public getBlockTitle(): string {
    return 'Création prestation'
  }

  public initForm(): void {
    this._app.form.removeFormData(`#${this._selectorForm}`)
  }

  public async send(): Promise<void> {
    const formData = this._app.form.convertToData(
      `#${this._selectorForm}`,
    ) as WorkFormInterface
    const rawEquipements = getEquipementsInForm()
    const equipements = rawEquipements.filter(
      (e) => typeof e === 'string' && e.trim().length > 0,
    )
    formData.equipements = equipements

    if (!handleSubmitForm(formData, formWorkSchema, this._selectorForm)) {
      return
    }

    await createWork(formData, this._app)
  }
}
