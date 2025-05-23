import Framework7 from 'framework7'

export default class Framework7DTO {
  /**
   * @param { Framework7 } $f7
   */
  constructor($f7, $el, $) {
    /**
     * @type { Framework7 }
     */
    this.app = $f7
    this.domElement = $el
    this.selectorF7 = $
  }

  /**
   * @returns { Framework7 }
   */
  getApp() {
    return this.app
  }

  getDomElement() {
    return this.domElement
  }

  getSelector() {
    return this.selectorF7
  }
}
