const createSheet = (date, framework7DTO, sendFiles) => {

    return framework7DTO.getApp().sheet.create({
        content: `
            <div class="sheet-modal">
                <div class="toolbar bg-color-primary text-color-white">
                    <div class="toolbar-inner justify-content-space-between">
                        <div class="left">Uploader les factures</div>
                        <div class="right">
                            <a class="link sheet-close text-color-white">
                                <i class="f7-icons">xmark_circle</i>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="sheet-modal-inner" style="display: flex; align-items: center; justify-content: center; height: 100%;">
                    <div class="block" style="text-align: center;">
                        <p style="color: #6c757d;">Veuillez choisir les factures que vous souhaitez uploader. Vous pouvez sélectionner plusieurs fichiers PDF à la fois.</p>
                        <form id="form-product-invoices" style="margin-bottom: 15%;">
                            <div class="list no-hairlines-md">
                                <ul>
                                    <li>
                                        <label class="item-input item-input-outline" style="width: 100%;">
                                            <input id="files" type="file" name="files[]" multiple accept="application/pdf" style="padding: 10px; text-align: center;">
                                        </label>
                                    </li>
                                </ul>
                            </div>
                            <div class="block display-flex justify-content-center">
                                <a href="#" id="btn-product-invoices" class="button button-tonal button-small button-round" style="width: 35%;">
                                    Uploader
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `,
        on: {
            open: function () {
                document.getElementById('btn-product-invoices').addEventListener('click', (event) => {
                    event.preventDefault()
                    sendFiles(date, framework7DTO)
                })
            }
        }
    })
}

export { createSheet }