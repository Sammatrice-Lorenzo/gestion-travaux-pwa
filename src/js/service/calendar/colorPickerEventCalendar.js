/**
 * @param {*} $f7
 * @param { ?String } color
 * @returns
 */
const createColorPickerForEventCalendar = ($f7, color = null) => {
  return $f7.colorPicker.create({
    inputEl: '#color-picker-spectrum',
    targetEl: '#color-picker-spectrum-value',
    targetElSetBackgroundColor: true,
    modules: ['sb-spectrum', 'hue-slider'],
    openIn: 'popover',
    value: {
      hex: color ?? '#ff0000',
    },
  })
}

export { createColorPickerForEventCalendar }
