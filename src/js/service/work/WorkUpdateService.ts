import type Framework7 from 'framework7'
import type { FormPageInteface } from '../../../intefaces/FormPageInteface'
import type WorkFormInterface from '../../../intefaces/Work/WorkFormInterface'
import type WorkInterface from '../../../intefaces/Work/WorkInterface'
import { toDatetimeLocalString } from '../../helper/date'
import { findWorkById, updateWork } from '../../work'
import {
  getEquipementsInForm,
  getInputEquipementUpdateForm,
} from '../../work/component/btnComponent'
import { handleSubmitForm } from '../form/formErrorInputs'
import { formWorkSchema } from '../schema/work/workSchema'

export default class WorkUpdateService implements FormPageInteface {
  constructor(
    private _app: Framework7,
    private _workId: number,
    private _selectorForm: string,
  ) {}

  public getPageTitle(): string {
    return 'Modification prestation'
  }

  public getBlockTitle(): string {
    return 'Modification informations'
  }

  public async initForm(): Promise<void> {
    const work = (await findWorkById(this._workId, this._app)) as WorkInterface

    const formWork: WorkFormInterface = {
      name: work.name,
      city: work.city,
      client: work.client.id,
      progression: work.progression,
      start: toDatetimeLocalString(new Date(work.start)),
      end: toDatetimeLocalString(new Date(work.end)),
      totalAmount: work.totalAmount,
      equipements: work.equipements,
    }

    this._app.form.fillFromData(`#${this._selectorForm}`, formWork)
    getInputEquipementUpdateForm(work.equipements)
  }

  public async send(): Promise<void> {
    const formData = this._app.form.convertToData(
      `#${this._selectorForm}`,
    ) as WorkFormInterface
    formData.equipements = getEquipementsInForm()
    if (!handleSubmitForm(formData, formWorkSchema, this._selectorForm)) {
      return
    }

    await updateWork(formData, this._workId, this._app)
  }
}
