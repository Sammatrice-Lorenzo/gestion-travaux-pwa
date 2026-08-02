import type SupplierReadInterface from '../Supplier/SupplierReadInterface'

export default interface SupplierReturnInvoiceInterface {
  id: number
  name: string
  path: string
  date: string | Date
  creditAmount: number
  supplier: SupplierReadInterface | null | undefined
  linkedProductInvoice?: { id: number; name: string } | null
}
