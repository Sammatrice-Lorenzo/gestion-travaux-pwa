import type ProductInvoiceInterface from '../ProductInvoice/ProductInvoiceInterface'

export default interface SupplierInterface {
  id?: number | null
  name: string
  address?: string | null
  city?: string | null
  country?: string | null
  phone?: string | null
  vatNumber?: string | null
  productInvoiceFiles?: ProductInvoiceInterface[]
}
