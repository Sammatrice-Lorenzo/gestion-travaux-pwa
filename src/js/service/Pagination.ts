export default class Pagination {
  public currentPage: number

  public totalItems: number

  public totalElementParPage: number

  public constructor(totalItems: number, totalElementParPage: number) {
    this.currentPage = 1
    this.totalItems = totalItems
    this.totalElementParPage = totalElementParPage
  }

  public getTotalPages(): number {
    return Math.ceil(this.totalItems / this.totalElementParPage)
  }

  public nextElement(
    prevButton: HTMLButtonElement,
    nextButton: HTMLButtonElement,
  ): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++
      this.updatePagination(prevButton, nextButton)
    }
  }

  public previousElement(
    prevButton: HTMLButtonElement,
    nextButton: HTMLButtonElement,
  ): void {
    if (this.currentPage > 1) {
      this.currentPage--
      this.updatePagination(prevButton, nextButton)
    }
  }

  public updatePagination(
    prevButton: HTMLButtonElement,
    nextButton: HTMLButtonElement,
  ): void {
    prevButton.disabled = this.currentPage === 1
    nextButton.disabled = this.currentPage === this.getTotalPages()

    const pageLinks = document.querySelectorAll('.page-links')
    for (const pageLink of pageLinks) {
      const dataPage: string | null = pageLink.getAttribute('data-page')
      if (dataPage) {
        pageLink.classList.toggle(
          'active',
          Number.parseInt(dataPage) === this.currentPage,
        )
      }
    }
  }

  public renderPageLinks(container: HTMLElement): void {
    container.innerHTML = ''

    for (let i = 1; i <= this.getTotalPages(); i++) {
      const a: HTMLAnchorElement = document.createElement('a')
      a.href = '#'
      a.classList.add('page-link')
      a.dataset.page = i.toString()
      a.textContent = i.toString()

      if (i === this.currentPage) {
        a.classList.add('active')
      }

      container.appendChild(a)
    }
  }

  public handleActionButtonsWithNumber(
    pageLinks: NodeListOf<HTMLElement>,
    prevButton: HTMLButtonElement,
    nextButton: HTMLButtonElement,
  ): void {
    for (const pageLink of pageLinks) {
      pageLink.addEventListener('click', (e: MouseEvent) => {
        e.preventDefault()
        const dataPage: string | null = pageLink.getAttribute('data-page')
        if (dataPage) {
          const page = Number.parseInt(dataPage)
          if (page !== this.currentPage) {
            this.currentPage = page
            this.updatePagination(prevButton, nextButton)
          }
        }
      })
    }
  }
}
