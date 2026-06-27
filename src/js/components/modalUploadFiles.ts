import type { Sheet } from 'framework7/types'
import type Framework7 from 'framework7/types'
import type SheetModalInterface from '../../intefaces/SheetModalInterface'

type SupplierOption = {
  id: number
  name: string
}

const SUPPLIER_SELECT_ID = 'supplier-return-supplier'

const buildSupplierSelectHtml = (suppliers: SupplierOption[]): string => {
  const options = suppliers
    .map((s) => `<option value="${s.id}">${s.name}</option>`)
    .join('')

  return `
    <div class="upload-sheet-supplier-wrap">
      <label for="${SUPPLIER_SELECT_ID}">
        Fournisseur (recommandé)
      </label>
      <select id="${SUPPLIER_SELECT_ID}">
        <option value="">— Sélectionner —</option>
        ${options}
      </select>
    </div>
  `
}

const createSheet = (
  app: Framework7,
  sheetModal: SheetModalInterface,
  sendFiles: CallableFunction,
  suppliers?: SupplierOption[],
): Sheet.Sheet => {
  const supplierBlock = suppliers?.length
    ? buildSupplierSelectHtml(suppliers)
    : ''

  return app.sheet.create({
    content: `
      <div class="sheet-modal sheet-upload-modal">
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
          <form id="${sheetModal.formId}">
            <p class="text-align-center text-color-gray upload-sheet-desc">${sheetModal.description}</p>
            <div class="upload-sheet-file-wrap">
              <label class="item-input item-input-outline upload-sheet-file-label">
                <span class="upload-sheet-file-hint">Appuyez pour choisir un ou plusieurs PDF</span>
                <input
                  id="${sheetModal.inputId}"
                  type="file"
                  name="${sheetModal.nameInput}"
                  multiple
                  accept="${sheetModal.acceptFiles}"
                />
              </label>
            </div>
            ${supplierBlock}
            <div class="upload-sheet-actions">
              <a href="#" id="btn-send-${sheetModal.formId}" class="button button-fill button-small button-round upload-sheet-submit">
                <i class="f7-icons">tray_arrow_up_fill</i>
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

        const supplierSelect = document.getElementById(
          SUPPLIER_SELECT_ID,
        ) as HTMLSelectElement | null
        if (supplierSelect) supplierSelect.value = ''

        const btn = document.getElementById(`btn-send-${sheetModal.formId}`)
        if (btn) {
          btn.onclick = (event: MouseEvent) => {
            event.preventDefault()
            sendFiles()
          }
        }
      },
    },
  })
}

export { createSheet, SUPPLIER_SELECT_ID }
