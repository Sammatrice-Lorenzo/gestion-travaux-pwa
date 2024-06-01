/**
 * @param {*} $f7 
 * @returns 
 */
const createColorPickerForEventCalendar = ($f7) => {
    return $f7.colorPicker.create({
        inputEl: '#color-picker-spectrum',
        targetEl: '#color-picker-spectrum-value',
        targetElSetBackgroundColor: true,
        modules: ['sb-spectrum', 'hue-slider'],
        openIn: 'popover',
        value: {
            hex: '#ff0000',
        },
    });
}

export { createColorPickerForEventCalendar }