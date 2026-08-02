export default interface SupplierReturnUpdateFormInterface {
  id: string
  name: string
  date: string
  'credit-amount': number
  supplier: string | null | undefined
  'linked-invoice'?: string | null
}
