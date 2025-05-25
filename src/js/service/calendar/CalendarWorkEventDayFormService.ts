import type Framework7 from 'framework7'
import type { ColorPicker } from 'framework7/components/color-picker'
import type { Popup } from 'framework7/components/popup'
import type EventsInterface from '../../../intefaces/WorkEventDay/EventInterface.ts'
import type { EventItemInteface } from '../../../intefaces/WorkEventDay/EventItermInterface.ts'
import type FormWorkEventDayInterface from '../../../intefaces/WorkEventDay/FormWorkEventDayInteface.ts'
import type Framework7DTO from '../../Framework7DTO.js'
import {
  createWorkEventDay,
  deleteWorkEventDay,
  updateWorkEventDay,
} from '../../workEventDay.js'
import { FormWorkEventDaySchema } from '../../workEventDay/workEventDaySchema.ts'
import { handleSubmitForm } from '../form/formErrorInputs.ts'
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

  private _indexOfEventToEdit: number

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

  public async send(
    framework7DTO: Framework7DTO,
    popup: Popup.Popup,
  ): Promise<void> {
    const $f7: Framework7 = framework7DTO.getApp()
    const formData: FormWorkEventDayInterface = $f7.form.convertToData(
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

    const $ = framework7DTO.getSelector()

    const dateSelected = new Date($f7.calendar.get().value[0])

    const workEventDay: EventsInterface = getWorkDayCalendar(
      formData,
      dateSelected,
    )
    if ($(this._selectorForm).hasClass('edit')) {
      const id = this._events[this.getIndexOfEventToEdit()].id
      workEventDay.id = id
      this._events[this.getIndexOfEventToEdit()] = workEventDay
      updateWorkEventDay(workEventDay, id, $f7)
      $(this._selectorForm).removeClass('edit')
    } else {
      const futureId = getMaxId(this._events) + 1
      workEventDay.id = futureId
      this._events.push(workEventDay)
      createWorkEventDay(workEventDay, $f7)
    }

    popup.close()
  }

  public edit(framework7DTO: Framework7DTO, element: MouseEvent): void {
    const $f7: Framework7 = framework7DTO.getApp()
    const $ = framework7DTO.getSelector()
    const idElement = Number.parseInt(getElementEdit(element))
    const textUpdate = 'Modification événement'
    this._indexOfEventToEdit = this._events.findIndex(
      (event) => event.id === idElement,
    )

    $(this._selectorForm).find('.block-title').children().text(textUpdate)
    $('.title-popup').text(textUpdate)

    const formCalendar = getEventSelected(
      idElement,
      this._eventItems,
      framework7DTO,
    )
    this._colorPickerSpectrum = createColorPickerForEventCalendar(
      $f7,
      formCalendar.color,
    )
  }

  public removeEvent(element: MouseEvent, framework7DTO: Framework7DTO): void {
    const idElement = Number.parseInt(getElementEdit(element))
    deleteWorkEventDay(idElement, framework7DTO.getApp())
  }
}
