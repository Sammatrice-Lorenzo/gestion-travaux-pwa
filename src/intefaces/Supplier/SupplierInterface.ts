import type ProductInvoiceInterface from '../ProductInvoice/ProductInvoiceInterface'

export default interface SupplierInterface {
  id?: number | null
  name: string
  address: string
  city: string
  country: string
  phone?: string | null
  vatNumber?: string | null
  productInvoiceFiles?: ProductInvoiceInterface[]
}
