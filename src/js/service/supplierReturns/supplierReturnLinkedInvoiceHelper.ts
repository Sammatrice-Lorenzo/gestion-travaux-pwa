import type Framework7 from 'framework7'
import type ProductInvoiceInterface from '../../../intefaces/ProductInvoice/ProductInvoiceInterface'

const HIGHLIGHT_PRODUCT_INVOICE_KEY = 'highlightProductInvoiceId'
const HIGHLIGHT_SUPPLIER_RETURN_KEY = 'highlightSupplierReturnId'
const HIGHLIGHT_SUPPLIER_RETURN_DATE_KEY = 'highlightSupplierReturnDate'

export function getLinkableProductInvoices(
  productInvoices: ProductInvoiceInterface[],
  supplierId: number | null | undefined,
  currentLinkedId: number | null | undefined,
): ProductInvoiceInterface[] {
  let filtered = supplierId
    ? productInvoices.filter((invoice) => invoice.supplier?.id === supplierId)
    : productInvoices

  if (
    currentLinkedId &&
    !filtered.some((invoice) => invoice.id === currentLinkedId)
  ) {
    const currentLinked = productInvoices.find(
      (invoice) => invoice.id === currentLinkedId,
    )
    if (currentLinked) {
      filtered = [currentLinked, ...filtered]
    }
  }

  return filtered
}

export function formatProductInvoiceOptionLabel(
  invoice: ProductInvoiceInterface,
): string {
  const amount = `${Number(invoice.totalAmount).toFixed(2)} €`
  const supplier = invoice.supplier?.name ? ` — ${invoice.supplier.name}` : ''

  return `${invoice.name} (${amount})${supplier}`
}

export function navigateToLinkedProductInvoice(
  app: Framework7,
  invoiceId: number,
): void {
  sessionStorage.setItem(HIGHLIGHT_PRODUCT_INVOICE_KEY, String(invoiceId))
  app.views.main.router.navigate('/product/invoices/')
}

export function navigateToLinkedSupplierReturn(
  app: Framework7,
  returnId: number,
  returnDate?: string | Date,
): void {
  sessionStorage.setItem(HIGHLIGHT_SUPPLIER_RETURN_KEY, String(returnId))
  if (returnDate) {
    const date =
      returnDate instanceof Date
        ? returnDate.toISOString().slice(0, 10)
        : returnDate
    sessionStorage.setItem(HIGHLIGHT_SUPPLIER_RETURN_DATE_KEY, date)
  } else {
    sessionStorage.removeItem(HIGHLIGHT_SUPPLIER_RETURN_DATE_KEY)
  }
  app.views.main.router.navigate('/supplier/returns/')
}

export function consumeHighlightedSupplierReturnDate(): string | null {
  const raw = sessionStorage.getItem(HIGHLIGHT_SUPPLIER_RETURN_DATE_KEY)
  sessionStorage.removeItem(HIGHLIGHT_SUPPLIER_RETURN_DATE_KEY)

  return raw || null
}

export function consumeHighlightedProductInvoiceId(): number | null {
  const raw = sessionStorage.getItem(HIGHLIGHT_PRODUCT_INVOICE_KEY)
  sessionStorage.removeItem(HIGHLIGHT_PRODUCT_INVOICE_KEY)

  if (!raw) {
    return null
  }

  const id = Number.parseInt(raw, 10)

  return Number.isNaN(id) ? null : id
}

export function consumeHighlightedSupplierReturnId(): number | null {
  const raw = sessionStorage.getItem(HIGHLIGHT_SUPPLIER_RETURN_KEY)
  sessionStorage.removeItem(HIGHLIGHT_SUPPLIER_RETURN_KEY)

  if (!raw) {
    return null
  }

  const id = Number.parseInt(raw, 10)

  return Number.isNaN(id) ? null : id
}
