import type { Sheet } from 'framework7/types'
import type Framework7 from 'framework7/types'
import type SheetModalInterface from '../../intefaces/SheetModalInterface'

const createSheet = (
  app: Framework7,
  sheetModal: SheetModalInterface,
  sendFiles: CallableFunction,
): Sheet.Sheet => {
  let isListenerAdded = false

  return app.sheet.create({
    content: `
      <div class="sheet-modal">
        <div class="toolbar bg-color-primary text-color-white">
          <div class="toolbar-inner justify-content-space-between">
            <div class="left" style="padding: 3%;">${sheetModal.title}</div>
            <div class="right">
              <a class="link sheet-close text-color-white">
                <i class="f7-icons">xmark_circle</i>
              </a>
            </div>
          </div>
        </div>
        <div class="sheet-modal-inner text-aligns-center">
          <form id=${sheetModal.formId}>
            <div class="display-flex justify-content-center flex-direction-column">
              <p class="text-align-center text-color-gray" style="padding: 0.3rem">${sheetModal.description}</p>
              <div style="margin: auto;">
                <label class="item-input item-input-outline" style="width: 100%;">
                  <input id=${sheetModal.inputId} type="file" name=${sheetModal.nameInput} multiple accept="${sheetModal.acceptFiles}" style="padding: 10px; text-align: center;">
                </label>
              </div>
            </div>
            <div class="block display-flex justify-content-center margin-top">
              <a href="#" id="btn-send-files" class="button button-tonal button-small button-round" style="width: 35%; gap: 0.5rem">
                <i class="f7-icons" style="font-size: 1.3rem;">tray_arrow_up_fill</i>
                Uploader
              </a>
            </div>
          </form>
        </div>
      </div>
    `,
    on: {
      open: () => {
        const filesInput = document.getElementById(
          sheetModal.inputId,
        ) as HTMLInputElement
        if (filesInput) filesInput.value = ''

        const btn: HTMLElement | null =
          document.getElementById('btn-send-files')
        if (!isListenerAdded && btn) {
          btn.addEventListener('click', (event: MouseEvent) => {
            event.preventDefault()
            sendFiles()
          })

          isListenerAdded = true
        }
      },
    },
  })
}

export { createSheet }
