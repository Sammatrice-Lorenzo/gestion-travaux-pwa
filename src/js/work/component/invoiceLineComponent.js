const deleteInvoiceLine = (event) => {
    const lineElement = event.target.closest('.new-line')
    lineElement.parentNode.removeChild(lineElement)
}

const lineTemplate = (id) => {
    return `<li>
        <div class="item-content item-input">
            <div class="item-inner">
                <div class="item-title item-label">Localisation</div>
                <div class="item-input-wrap">
                    <input name='localisation${id}' type="text" placeholder="Localisation" />
                </div>
            </div>
        </div>
    </li>
    <li>
        <div class="item-content item-input">
            <div class="item-inner">
                <div class="item-title item-label">Description prestation</div>
                <div class="item-input-wrap">
                    <input name='description${id}' type="text" placeholder="Dépose des éléments sanitaires" />
                </div>
            </div>
        </div>
    </li>
    <li>
        <div class="item-content item-input">
            <div class="item-inner">
                <div class="item-title item-label">Prix unitaire</div>
                <div class="item-input-wrap">
                    <input name='price_unitaire${id}' type="text" placeholder="Ensemble" />
                </div>
            </div>
        </div>
    </li>
    <li>
        <div class="item-content item-input">
            <div class="item-inner">
                <div class="item-title item-label">Prix total de la ligne</div>
                <div class="item-input-wrap">
                    <input name='total_line${id}' type="number" placeholder="100.00" min="0.00" step="0.01"/>
                </div>
            </div>
        </div>
    </li>
`}

const addInvoiceLine = (event) => {
    event.preventDefault()
    const invoiceLinesContainer = document.getElementById('invoice-lines')

    const deleteButtonElement = `
        <span class="display-flex justify-content-center">
            <a href="#" class="button button-small button-round button-fill color-red delete-line">
                <i class="f7-icons">trash_circle</i>
            </a>
        </span>
    `
        
    const lineElement = document.createElement('ul')

    const lastId = document.getElementsByClassName('new-line')?.length + 1

    const buttonDeleteLine = document.createElement('div')
    buttonDeleteLine.className = 'block'
    buttonDeleteLine.innerHTML = deleteButtonElement
    lineElement.innerHTML = lineTemplate(lastId)
    lineElement.className = "new-line"

    buttonDeleteLine.addEventListener('click', deleteInvoiceLine)

    lineElement.appendChild(buttonDeleteLine)
    invoiceLinesContainer.appendChild(lineElement)
}


export { addInvoiceLine }
