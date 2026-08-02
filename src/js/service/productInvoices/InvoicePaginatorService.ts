import type Pagination from '../Pagination'

export default class InvoicePaginatorService {
  public itemLabel = 'factures'

  public paginateCards(cards: HTMLElement[], pagination: Pagination): void {
    const start = (pagination.currentPage - 1) * pagination.totalElementParPage
    const end = start + pagination.totalElementParPage

    for (const [i, card] of cards.entries()) {
      card.style.display = i >= start && i < end ? 'block' : 'none'
    }

    const info = document.getElementById('pagination-info')
    if (info) {
      info.innerHTML = `Affichage des ${this.itemLabel} <strong>${start + 1}</strong> à <strong>${Math.min(
        end,
        cards.length,
      )}</strong> sur <strong>${cards.length}</strong>`
    }
  }
}
