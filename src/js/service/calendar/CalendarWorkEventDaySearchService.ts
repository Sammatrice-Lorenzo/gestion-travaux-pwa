import type Framework7 from 'framework7'
import type WorkEventDaySearchCriteriaInterface from '../../../intefaces/WorkEventDay/WorkEventDaySearchCriteriaInterface'
import type WorkEventDaySearchResultInterface from '../../../intefaces/WorkEventDay/WorkEventDaySearchResultInterface'
import {
  downloadWorkEventDaySearchExport,
  searchWorkEventDays,
} from '../../workEventDay.ts'
import { handleSubmitForm } from '../form/formErrorInputs.ts'
import { workEventDaySearchSchema } from '../schema/workEventDay/workEventDaySearchSchema.ts'

export interface RawWorkEventDaySearchCriteria {
  client: string
  search: string
  startDate: string
  endDate: string
}

const buildCriteria = (
  rawCriteria: RawWorkEventDaySearchCriteria,
): WorkEventDaySearchCriteriaInterface => ({
  client: rawCriteria.client ? Number.parseInt(rawCriteria.client, 10) : null,
  search: rawCriteria.search,
  startDate: rawCriteria.startDate,
  endDate: rawCriteria.endDate,
})

export class CalendarWorkEventDaySearchService {
  public async search(
    app: Framework7,
    rawCriteria: RawWorkEventDaySearchCriteria,
    formId: string,
  ): Promise<WorkEventDaySearchResultInterface[]> {
    if (!handleSubmitForm(rawCriteria, workEventDaySearchSchema, formId)) {
      return []
    }

    return searchWorkEventDays(buildCriteria(rawCriteria), app)
  }

  public async export(
    app: Framework7,
    rawCriteria: RawWorkEventDaySearchCriteria,
    format: 'pdf' | 'xlsx',
  ): Promise<void> {
    await downloadWorkEventDaySearchExport(
      buildCriteria(rawCriteria),
      format,
      app,
    )
  }
}
