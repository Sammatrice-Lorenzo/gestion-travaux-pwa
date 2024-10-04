import { updateProductInvoice } from "../productInvoice"

const ID_FORM = '#form-product-invoice-edit'

const createPopup = (framework7DTO, formProductInvoice) => {
    const $f7 = framework7DTO.getApp()

    return $f7.popup.create({
        content: `
            <div class="popup">
                <div class="page">
                    <div class="navbar">
                        <div class="navbar-bg"></div>
                        <div class="navbar-inner">
                            <div class="title">Modification de la facture</div>
                            <div class="right">
                                <a class="link popup-close">
                                    <i class="f7-icons">xmark_circle</i>
                                </a>
                            </a>
                            </div>
                        </div>
                    </div>
                    <div class="page-content">
                        <div class="block">
                            <form id="form-product-invoice-edit">
                                <div class="block-title">Modification informations facture</div>
                                <div class="list list-strong-ios list-dividers-ios list-outline-ios">
                                    <ul>
                                        <li>
                                            <div class="item-content item-input">
                                                <div class="item-inner">
                                                    <div class="item-title item-label">Date de la facture</div>
                                                    <div class="item-input-wrap">
                                                        <input name='date' type="date"
                                                            placeholder="Date" 
                                                            required validate 
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div class="item-content item-input">
                                                <div class="item-inner">
                                                    <div class="item-title item-label">Total TCC</div>
                                                    <div class="item-input-wrap">
                                                        <input name='total-amount' type="number" min="0" step="0.01"
                                                            placeholder="150.50"
                                                            value="00.00" required validate 
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                    <div class="block display-flex justify-content-center">
                                        <a id="btn-update-product-invoice" href="#" class="button button-outline button-round">
                                            <i class="f7-icons">checkmark_circle</i>
                                        </a>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `,
        push: true,
        swipeToClose: true,
        on: {
            open: () => handleUpdateProductInvoice($f7, formProductInvoice),
            close: () => $f7.views.main.router.refreshPage()
        }
    })
}

const handleUpdateProductInvoice = ($f7, formProductInvoice) => {
    $f7.form.fillFromData(ID_FORM, formProductInvoice)

    document.getElementById('btn-update-product-invoice').addEventListener('click', (event) => {
        event.preventDefault()
        const formData = $f7.form.convertToData(ID_FORM)
        updateProductInvoice($f7, formProductInvoice.id, formData)
        $f7.popup.close()
    })
}


export { createPopup }