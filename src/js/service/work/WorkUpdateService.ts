import type Framework7 from 'framework7'
import type { FormPageInteface } from '../../../intefaces/FormPageInteface'
import type WorkFormInterface from '../../../intefaces/Work/WorkFormInterface'
import type WorkInterface from '../../../intefaces/Work/WorkInterface'
import { findWorkById, updateWork } from '../../work'
import {
  getEquipementsInForm,
  getInputEquipementUpdateForm,
} from '../../work/component/btnComponent'
import { handleSubmitForm } from '../form/formErrorInputs'
import { formWorkSchema } from './workSchema'

export default class WorkUpdateService implements FormPageInteface {
  constructor(
    private _app: Framework7,
    private workId: number,
    private _selectorForm: string,
  ) {}

  public getPageTitle(): string {
    return 'Modification prestation'
  }

  public getBlockTitle(): string {
    return 'Modification informations'
  }

  public async initForm(): Promise<void> {
    const work = (await findWorkById(this.workId, this._app)) as WorkInterface
    const formWork: WorkFormInterface = {
      name: work.name,
      city: work.city,
      client: work.client.id,
      progression: work.progression,
      start: work.start.split('+').shift(),
      end: work.end.split('+').shift(),
      totalAmount: work.totalAmount,
      equipements: work.equipements,
    }

    this._app.form.fillFromData(`#${this._selectorForm}`, formWork)
    getInputEquipementUpdateForm(work.equipements)
  }

  public send(): void {
    const formData = this._app.form.convertToData(
      `#${this._selectorForm}`,
    ) as WorkFormInterface
    formData.equipements = getEquipementsInForm()
    if (!handleSubmitForm(formData, formWorkSchema, this._selectorForm)) {
      return
    }

    updateWork(formData, this.workId, this._app)
  }
}
