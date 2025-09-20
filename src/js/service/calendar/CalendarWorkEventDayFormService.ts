import type Framework7 from 'framework7'
import type { ColorPicker } from 'framework7/components/color-picker'
import type { Popup } from 'framework7/components/popup'
import type EventsInterface from '../../../intefaces/WorkEventDay/EventInterface.ts'
import type { EventItemInteface } from '../../../intefaces/WorkEventDay/EventItermInterface.ts'
import type FormWorkEventDayInterface from '../../../intefaces/WorkEventDay/FormWorkEventDayInteface.ts'
import {
  createWorkEventDay,
  deleteWorkEventDay,
  updateWorkEventDay,
} from '../../workEventDay.js'
import { handleSubmitForm } from '../form/formErrorInputs.ts'
import { FormWorkEventDaySchema } from '../schema/workEventDay/workEventDaySchema.ts'
import {
  getElementEdit,
  getEventSelected,
  getMaxId,
  getWorkDayCalendar,
} from './calendarForm.ts'
import { createColorPickerForEventCalendar } from './colorPickerEventCalendar.ts'

export class CalendarWorkEventDayFormService {
  private _selectorForm = '#form-calendar'

  private _events: EventsInterface[] = []

  private _colorPickerSpectrum: ColorPicker.ColorPicker

  private _eventItems: EventItemInteface[] = []

  private _indexOfEventToEdit!: number

  constructor(
    events: EventsInterface[],
    colorPickerSpectrum: ColorPicker.ColorPicker,
  ) {
    this._events = events
    this._colorPickerSpectrum = colorPickerSpectrum
  }

  public getEvents(): EventsInterface[] {
    return this._events
  }

  public getIndexOfEventToEdit(): number {
    return this._indexOfEventToEdit
  }

  public getColorPickerSpectrum(): ColorPicker.ColorPicker {
    return this._colorPickerSpectrum
  }

  public setEventItems(eventItems: EventItemInteface[]): void {
    this._eventItems = eventItems
  }

  public setEvents(events: EventsInterface[]): void {
    this._events = events
  }

  public async send(app: Framework7, popup: Popup.Popup): Promise<void> {
    const formData: FormWorkEventDayInterface = app.form.convertToData(
      this._selectorForm,
    ) as FormWorkEventDayInterface
    if (
      !handleSubmitForm(
        formData,
        FormWorkEventDaySchema,
        this._selectorForm.replace('#', ''),
      )
    ) {
      return
    }

    const $ = app.$

    const dateSelected = new Date(app.calendar.get().value[0])

    const workEventDay: EventsInterface = getWorkDayCalendar(
      formData,
      dateSelected,
    )
    if ($(this._selectorForm).hasClass('edit')) {
      const id = this._events[this.getIndexOfEventToEdit()].id
      workEventDay.id = id
      this._events[this.getIndexOfEventToEdit()] = workEventDay
      await updateWorkEventDay(workEventDay, id, app)
      $(this._selectorForm).removeClass('edit')
    } else {
      const futureId = getMaxId(this._events) + 1
      workEventDay.id = futureId
      this._events.push(workEventDay)
      await createWorkEventDay(workEventDay, app)
    }

    popup.close()
  }

  public edit(app: Framework7, element: MouseEvent): void {
    const $ = app.$
    const idElement = Number.parseInt(getElementEdit(element))
    const textUpdate = 'Modification événement'
    this._indexOfEventToEdit = this._events.findIndex(
      (event) => event.id === idElement,
    )

    $(this._selectorForm).find('.block-title').children().text(textUpdate)
    $('.title-popup').text(textUpdate)

    const formCalendar = getEventSelected(idElement, this._eventItems, app)
    this._colorPickerSpectrum = createColorPickerForEventCalendar(
      app,
      formCalendar.color,
    )
  }

  public async removeEvent(
    element: MouseEvent,
    app: Framework7,
  ): Promise<void> {
    const idElement = Number.parseInt(getElementEdit(element))
    await deleteWorkEventDay(idElement, app)
  }
}
