import * as messages from './messages'
import { getUrl } from './urlGenerator'

/**
 * @param { Dom7 } $$
 * @param { any } $f7 
 * @returns { boolean }
 */
function isValidForm($$, $f7) {
    const form = $$('form#form-work-invoice')
    const inputs = $$(form).find('input')

    let isValid = true

    inputs.forEach(function(input) {
        const divParent = $$(input).closest('.item-inner')
        if (input.value.trim() === '') {
            isValid = false
            const label = $$(divParent).find('.item-title').text()
            $f7.dialog.alert(`${label} ne peut pas être vide.`)
            $$(divParent).addClass('input-error')
        } else {
            $$(divParent).removeClass('input-error')
        }
    })

    return isValid
}

/**
 * @param { Object } form 
 * @param { number } idClient 
 */
function getBody(form, idClient) {
    const invoiceLines = Object.values(form)
    const nameInvoice = invoiceLines.shift()

    const chunk = (arr, size) => 
        Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
            arr.slice(i * size, i * size + size)
        )
    
    return JSON.stringify({
        nameInvoice: nameInvoice,
        invoiceLines: chunk(invoiceLines, 4),
        idClient: idClient
    })
}

/**
 * @param { FormData } form 
 * @param { any } $f7 
 * @param { number } idClient 
 */
function createInvoiceWork(form, $f7, idClient)
{
    const url = getUrl('/api/invoice-file')
    const body = getBody(form, idClient)

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: body
    }).then(response =>
        response
            .blob()
            .then(function (data) {
                const blobUrl = window.URL.createObjectURL(data)
        
                const link = document.createElement('a')
                link.href = blobUrl
                link.download = 'facture_prestation.pdf'
        
                link.style.display = 'none'
                link.click()
            })
    )
        .catch(error => {
            console.log(error)
            $f7.dialog.alert(messages.ERROR_SERVER)
        })
}

export { createInvoiceWork, isValidForm }