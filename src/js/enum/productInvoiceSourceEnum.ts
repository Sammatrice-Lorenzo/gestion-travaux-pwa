const productInvoiceSourceEnum = Object.freeze({
  MANUAL: 'manual',
  QONTO: 'qonto',
} as const)

type ProductInvoiceSource =
  (typeof productInvoiceSourceEnum)[keyof typeof productInvoiceSourceEnum]

export { productInvoiceSourceEnum, type ProductInvoiceSource }
