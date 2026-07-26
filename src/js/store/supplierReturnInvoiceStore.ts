import { createStore } from 'framework7'
import type SupplierReturnInvoiceInterface from '../../intefaces/SupplierReturn/SupplierReturnInvoiceInterface'

interface State {
  invoices: SupplierReturnInvoiceInterface[]
  filteredInvoices: SupplierReturnInvoiceInterface[]
}

type StoreState = { state: State }

const supplierReturnInvoiceStore = createStore({
  state: {
    invoices: [] as SupplierReturnInvoiceInterface[],
    filteredInvoices: [] as SupplierReturnInvoiceInterface[],
  },
  getters: {
    getInvoices({ state }: StoreState) {
      return state.invoices
    },
    getFilteredInvoices({ state }: StoreState) {
      return state.filteredInvoices
    },
    getInvoiceById:
      ({ state }: StoreState) =>
      (id: number) =>
        state.invoices.find((invoice) => invoice.id === id),
  },
  actions: {
    setInvoices(
      { state }: StoreState,
      invoices: SupplierReturnInvoiceInterface[],
    ) {
      state.invoices = [...invoices]
      state.filteredInvoices = [...invoices]
    },
    setFilteredInvoices(
      { state }: StoreState,
      invoices: SupplierReturnInvoiceInterface[],
    ) {
      state.filteredInvoices = [...invoices]
    },
    updateInvoice(
      { state }: StoreState,
      updated: SupplierReturnInvoiceInterface,
    ) {
      const index = state.invoices.findIndex((i) => i.id === updated.id)
      if (index !== -1) {
        state.invoices[index] = updated
      }
      const filteredIndex = state.filteredInvoices.findIndex(
        (i) => i.id === updated.id,
      )
      if (filteredIndex !== -1) {
        state.filteredInvoices[filteredIndex] = updated
      }
    },
    removeInvoice({ state }: StoreState, id: number) {
      state.invoices = state.invoices.filter((inv) => inv.id !== id)
      state.filteredInvoices = state.filteredInvoices.filter(
        (inv) => inv.id !== id,
      )
    },
  },
})

export default supplierReturnInvoiceStore
