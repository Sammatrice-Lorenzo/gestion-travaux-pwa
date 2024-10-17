import { CONFIRMATION_TO_DELETE } from "../../messages"
import { deleteProductInvoice, downloadFileProductInvoice, downloadZIP } from "../../productInvoice"
import { getIdOfElementClicked } from '../../helper/domElementClick'
import { getAmountWithoutTVA } from "../../helper/priceWorkHelper"
import { tvaEnum } from "../../enum/tvaEnum"
import Framework7DTO from "../../Framework7DTO"

/**
 * @param { HTMLElement } element 
 * @param { Framework7DTO } framework7DTO 
 */
const handleDeleteProductInvoice = async (element, framework7DTO, productInvoicesByUser) => {
    const $f7 = framework7DTO.getApp()
    const invoiceId = getIdOfElementClicked(framework7DTO.getSelector(), element)

    return $f7.dialog.confirm(CONFIRMATION_TO_DELETE, async function () {
        await deleteProductInvoice($f7, invoiceId)

        productInvoicesByUser = productInvoicesByUser.filter(product => product.id !== invoiceId)
        framework7DTO.updateView()
    })
}

/**
 * @param { HTMLElement } element 
 * @param {  Framework7DTO } framework7DTO 
 * @param { Array } productInvoicesByUser 
 */
const downloadPDF = (element, framework7DTO, productInvoicesByUser) => {
    const $f7 = framework7DTO.getApp()

    const invoiceId = getIdOfElementClicked(framework7DTO.getSelector(), element)
    const productInvoice = productInvoicesByUser.filter(productInvoice => productInvoice.id === parseInt(invoiceId))[0]

    downloadFileProductInvoice($f7, productInvoice)
}

/**
 * 
 * @param { String[] } selectedInvoices 
 * @param {*} $f7 
 * @param { Date } date 
 * @returns { void }
 */
const downloadSelectedInvoices = (selectedInvoices, $f7, date) => {
    if (selectedInvoices.length < 1) {
        $f7.dialog.alert('Veuillez sélectionner au moins une facture !')
        return
    }

    downloadZIP($f7, selectedInvoices, date)
}

const totalAmountProductInvoices = (productInvoicesByUser) => {
    return productInvoicesByUser.length >= 1
        ? (productInvoicesByUser
            .map(invoice => invoice.totalAmount)
            .reduce((accumulator, current) => accumulator + current)).toFixed(2)
        : 0
}

const getTVAOfTotalAmountProductInvoiceFiles = (productInvoicesByUser) => {
    const total = totalAmountProductInvoices(productInvoicesByUser)

    return (total - getAmountWithoutTVA(total, tvaEnum.TVA_PRODUCT)).toFixed(2)
}

export {
    handleDeleteProductInvoice,
    downloadPDF,
    downloadSelectedInvoices,
    totalAmountProductInvoices,
    getTVAOfTotalAmountProductInvoiceFiles
}