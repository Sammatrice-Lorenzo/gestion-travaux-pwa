export default class Framework7DTO {
  constructor($f7, $el, $) {
    this.app = $f7
    this.domElement = $el
    this.selectorF7 = $
  }

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
