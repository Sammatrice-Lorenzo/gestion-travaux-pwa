import type Framework7 from 'framework7'
import type { ColorPicker } from 'framework7/components/color-picker'

const createColorPickerForEventCalendar = (
  $f7: Framework7,
  color: string | null = null,
): ColorPicker.ColorPicker => {
  return $f7.colorPicker.create({
    inputEl: '#color-picker-spectrum',
    targetEl: '#color-picker-spectrum-value',
    targetElSetBackgroundColor: true,
    modules: ['sb-spectrum', 'hue-slider'],
    openIn: 'popover',
    value: {
      hex: color ?? '#ff0000',
    },
    navbarCloseText: '',
    navbarTitleText: '',
    navbarBackLinkText: '',
  })
}

export { createColorPickerForEventCalendar }
