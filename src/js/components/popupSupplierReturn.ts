import type Framework7 from 'framework7'
import type SupplierInterface from '../../intefaces/Supplier/SupplierInterface'
import type SupplierReturnUpdateFormInterface from '../../intefaces/SupplierReturn/SupplierReturnUpdateFormInterface'

const ID_FORM = 'form-supplier-return-edit'

const createPopup = (
  app: Framework7,
  formSupplierReturn: SupplierReturnUpdateFormInterface,
  handleSupplierReturnUpdate: CallableFunction,
  suppliers: SupplierInterface[],
) => {
  const $f7 = app

  return $f7.popup.create({
    content: `
      <div class="popup">
        <div class="page">
          <div class="navbar">
            <div class="navbar-bg bg-color-primary"></div>
            <div class="navbar-inner">
              <div class="title text-color-text">Modifier l'avoir</div>
              <div class="right">
                <a class="link popup-close text-color-text">
                  <i class="f7-icons">xmark_circle</i>
                </a>
              </div>
            </div>
          </div>
          <div class="page-content">
            <div class="block">
              <form id="${ID_FORM}">
                <div class="block-title">Informations du document</div>
                <div class="list list-strong-ios list-dividers-ios list-outline-ios">
                  <ul>
                    <li>
                      <div class="item-content item-input">
                        <div class="item-inner">
                          <div class="item-title item-label">Titre</div>
                          <div class="item-input-wrap">
                            <input name="name" type="text" placeholder="Nom du document" required validate />
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div class="item-content item-input">
                        <div class="item-inner">
                          <div class="item-title item-label">Date</div>
                          <div class="item-input-wrap">
                            <input name="date" type="date" required validate />
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div class="item-content item-input">
                        <div class="item-inner">
                          <div class="item-title item-label">Montant crédit (€)</div>
                          <div class="item-input-wrap">
                            <input
                              name="credit-amount"
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="150.50"
                              required
                              validate
                            />
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div class="item-content item-input">
                        <div class="item-inner">
                          <div class="item-input-wrap">
                            <a
                              class="item-link smart-select smart-select-init"
                              data-open-in="popup"
                              data-searchbar="true"
                              data-searchbar-placeholder="Rechercher le fournisseur"
                              data-close-placeholder="Fermer"
                            >
                              <select name="supplier">
                                ${suppliers
                                  .map(
                                    (supplier) => `
                                  <option id="supplier-return-option-${supplier.id}" value="${supplier.id}">${supplier.name}</option>
                                `,
                                  )
                                  .join('')}
                                <option value="" selected>Aucun</option>
                              </select>
                              <div class="item-content">
                                <div class="item-inner">
                                  <div class="item-title">Fournisseur</div>
                                </div>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <div class="block display-flex justify-content-center margin-top">
                    <a id="btn-update-supplier-return" href="#" class="button button-fill button-round" style="width: 60%;">
                      <i class="f7-icons">checkmark</i>
                      Enregistrer
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
      open: () => fillData($f7, formSupplierReturn, handleSupplierReturnUpdate),
    },
  })
}

const fillData = (
  $f7: Framework7,
  formSupplierReturn: SupplierReturnUpdateFormInterface,
  handleSupplierReturnUpdate: CallableFunction,
) => {
  $f7.form.fillFromData(`#${ID_FORM}`, formSupplierReturn)

  const button: HTMLElement | null = document.getElementById(
    'btn-update-supplier-return',
  )

  if (button) {
    button.onclick = async (event: MouseEvent) => {
      event.preventDefault()
      await handleSupplierReturnUpdate($f7, formSupplierReturn, ID_FORM)
    }
  }
}

export { createPopup, ID_FORM }
