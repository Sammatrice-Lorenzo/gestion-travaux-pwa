export default class Pagination {
  public currentPage: number
  public totalItems = 0
  public totalElementParPage: number
  private _updateContentCallback!: CallableFunction
  public paginationContainer!: HTMLElement

  constructor(totalElementParPage: number) {
    this.currentPage = 1
    this.totalElementParPage = totalElementParPage
  }

  public setUpdateContentCallBack(updateContent: CallableFunction): void {
    this._updateContentCallback = updateContent
  }

  public getTotalPages(): number {
    return Math.ceil(this.totalItems / this.totalElementParPage)
  }

  private async handleUpdateElement(
    prevButton: HTMLButtonElement,
    nextButton: HTMLButtonElement,
  ): Promise<void> {
    this.updatePagination(prevButton, nextButton)
    await this._updateContentCallback()
  }

  public async nextElement(
    prevButton: HTMLButtonElement,
    nextButton: HTMLButtonElement,
  ): Promise<void> {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++
      this.handleUpdateElement(prevButton, nextButton)
    }
  }

  public async previousElement(
    prevButton: HTMLButtonElement,
    nextButton: HTMLButtonElement,
  ): Promise<void> {
    if (this.currentPage > 1) {
      this.currentPage--
      this.handleUpdateElement(prevButton, nextButton)
    }
  }

  public updatePagination(
    prevButton: HTMLButtonElement,
    nextButton: HTMLButtonElement,
  ): void {
    prevButton.disabled = this.currentPage === 1
    nextButton.disabled = this.currentPage === this.getTotalPages()

    this.renderPageLinks(this.paginationContainer)
    this.handleActionButtonsWithNumber(prevButton, nextButton)
  }

  public renderPageLinks(container: HTMLElement): void {
    container.innerHTML = ''
    const maximumVisbleLinkPages: number = 3
    const totalPages: number = this.getTotalPages()

    let startPage: number = Math.max(
      this.currentPage - Math.floor(maximumVisbleLinkPages / 2),
      1,
    )
    let endPage: number = startPage + maximumVisbleLinkPages - 1
    if (endPage > totalPages) {
      endPage = totalPages
      startPage = Math.max(endPage - maximumVisbleLinkPages + 1, 1)
    }

    for (let i = startPage; i <= endPage; i++) {
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

  private handleActionButtonsWithNumber(
    prevButton: HTMLButtonElement,
    nextButton: HTMLButtonElement,
  ): void {
    this.paginationContainer.onclick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.classList.contains('page-link')) {
        e.preventDefault()
        const dataPage = target.getAttribute('data-page')
        if (dataPage) {
          const page = Number.parseInt(dataPage)
          if (page !== this.currentPage) {
            this.currentPage = page
            this.updatePagination(prevButton, nextButton)
            await this._updateContentCallback()
          }
        }
      }
    }
  }
}
