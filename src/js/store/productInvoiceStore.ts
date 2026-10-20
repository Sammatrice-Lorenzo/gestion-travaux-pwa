import { createStore } from 'framework7'
import type ProductInvoiceInterface from '../../intefaces/ProductInvoice/ProductInvoiceInterface'

interface StateProductInvoice {
  productInvoices: ProductInvoiceInterface[]
  filteredInvoices: ProductInvoiceInterface[]
  /** Début de la synchro Qonto en cours (ms), partagé entre les instances de la page des factures */
  qontoSyncStartedAt: number | null
}

type State = {
  state: StateProductInvoice
}

const productInvoiceStore = createStore({
  state: {
    productInvoices: [] as ProductInvoiceInterface[],
    filteredInvoices: [] as ProductInvoiceInterface[],
    qontoSyncStartedAt: null as number | null,
  },
  getters: {
    getInvoices({ state }: State) {
      return state.productInvoices
    },
    getFilteredInvoices({ state }: State) {
      return state.filteredInvoices
    },
    getQontoSyncStartedAt({ state }: State) {
      return state.qontoSyncStartedAt
    },
    getInvoiceById:
      ({ state }: State) =>
      (id: number) => {
        return state.productInvoices.find(
          (invoice: ProductInvoiceInterface) => invoice.id === id,
        )
      },
  },
  actions: {
    setInvoices({ state }: State, invoices: ProductInvoiceInterface[]) {
      state.productInvoices = [...invoices]
      state.filteredInvoices = [...invoices]
    },
    setFilteredInvoices({ state }: State, invoices: ProductInvoiceInterface[]) {
      state.filteredInvoices = [...invoices]
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
    startQontoSync({ state }: State, startedAt: number) {
      state.qontoSyncStartedAt = startedAt
    },
    endQontoSync({ state }: State) {
      state.qontoSyncStartedAt = null
    },
    removeInvoice({ state }: State, id: number) {
      state.productInvoices = state.productInvoices.filter(
        (inv) => inv.id !== id,
      )
    },
  },
})
export default productInvoiceStore
