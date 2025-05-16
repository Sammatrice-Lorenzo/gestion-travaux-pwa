function getAllInvoicesSelected(event, productInvoicesByUser, $) {
  const isChecked = $(event.target).is(':checked')
  const selectedInvoices = isChecked
    ? productInvoicesByUser.map((invoice) => invoice.id)
    : []

  $('.data-table tbody input[type="checkbox"]').prop('checked', isChecked)

  return selectedInvoices
}

function getInvoiceSelected(invoice, selectedInvoices) {
  if (selectedInvoices.includes(invoice.id)) {
    selectedInvoices = selectedInvoices.filter((id) => id !== invoice.id)
  } else {
    selectedInvoices.push(invoice.id)
  }

  return selectedInvoices
}

export { getAllInvoicesSelected, getInvoiceSelected }
