import type SupplierReadInterface from '../Supplier/SupplierReadInterface'
import type LinkedSupplierReturnInterface from './LinkedSupplierReturnInterface'

export default interface ProductInvoiceInterface {
  id: number
  name: string
  path: string
  date: string | Date
  totalAmount: number
  supplier: SupplierReadInterface | null | undefined
  linkedSupplierReturns?: LinkedSupplierReturnInterface[]
}
