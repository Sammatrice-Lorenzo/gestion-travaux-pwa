import type Framework7 from 'framework7'
import type ProductInvoiceUpdateFormInterface from '../../intefaces/ProductInvoice/ProductInvoiceUpdateFormInterface'

const ID_FORM = 'form-product-invoice-edit'

const createPopup = (
  app: Framework7,
  formProductInvoice: ProductInvoiceUpdateFormInterface,
  handleProductInvoiceUpdate: CallableFunction,
) => {
  const $f7 = app

  return $f7.popup.create({
    content: `
      <div class="popup">
        <div class="page">
          <div class="navbar">
            <div class="navbar-bg bg-color-primary"></div>
            <div class="navbar-inner">
              <div class="title text-color-text">Modification de la facture</div>
                <div class="right">
                  <a class="link popup-close text-color-text">
                    <i class="f7-icons">xmark_circle</i>
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
                          <div class="item-title item-label">Nom facture</div>
                          <div class="item-input-wrap">
                            <input name='name' type="text"
                              placeholder="Nom de la facture" 
                              required validate 
                            />
                          </div>
                        </div>
                      </div>
                    </li>
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
                  <div class="block display-flex justify-content-center margin-top">
                    <a id="btn-update-product-invoice" href="#" class="button button-tonal button-small button-round" style="width: 35%;">
                      <i class="f7-icons">checkmark</i>
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
      open: () => fillData($f7, formProductInvoice, handleProductInvoiceUpdate),
      close: () => $f7.view.current.router.refreshPage(),
    },
  })
}

const fillData = (
  $f7: Framework7,
  formProductInvoice: ProductInvoiceUpdateFormInterface,
  handleProductInvoiceUpdate: CallableFunction,
) => {
  $f7.form.fillFromData(`#${ID_FORM}`, formProductInvoice)

  const buttonProductInvoice: HTMLElement | null = document.getElementById(
    'btn-update-product-invoice',
  )

  if (buttonProductInvoice) {
    buttonProductInvoice.addEventListener(
      'click',
      async (event: MouseEvent) => {
        event.preventDefault()
        await handleProductInvoiceUpdate($f7, formProductInvoice, ID_FORM)
      },
    )
  }
}

export { createPopup }
