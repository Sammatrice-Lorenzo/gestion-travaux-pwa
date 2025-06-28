import { createStore } from 'framework7'
import type ProductInvoiceInterface from '../../intefaces/ProductInvoice/ProductInvoiceInterface'

interface StateProductInvoice {
  productInvoices: ProductInvoiceInterface[]
}

type State = {
  state: StateProductInvoice
}

const productInvoiceStore = createStore({
  state: {
    productInvoices: [] as ProductInvoiceInterface[],
  },
  getters: {
    getInvoices({ state }: State) {
      return state.productInvoices
    },
    getInvoiceById:
      ({ state }) =>
      (id: number) => {
        return state.productInvoices.find((invoice) => invoice.id === id)
      },
  },
  actions: {
    setInvoices({ state }: State, invoices: ProductInvoiceInterface[]) {
      state.productInvoices = invoices
    },
    updateInvoice({ state }: State, updatedInvoice: ProductInvoiceInterface) {
      const index = state.productInvoices.findIndex(
        (i) => i.id === updatedInvoice.id,
      )
      if (index !== -1) {
        state.productInvoices[index] = updatedInvoice
      } else {
        state.productInvoices.push(updatedInvoice)
      }
    },
    addInvoice({ state }: State, newInvoice: ProductInvoiceInterface) {
      state.productInvoices.push(newInvoice)
    },
    removeInvoice({ state }: State, id: number) {
      state.productInvoices = state.productInvoices.filter(
        (inv) => inv.id !== id,
      )
    },
  },
})
export default productInvoiceStore
