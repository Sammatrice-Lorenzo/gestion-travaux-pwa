export class RouteDTO {
  route = '/'
  body = null
  method = 'GET'
  idElement = 0
  urlAPI = ''
  app = null
  contentType = null

  /**
   * @param { String } route
   * @returns { this }
   */
  setRoute(route) {
    this.route = route

    return this
  }

  /**
   * @returns { String }
   */
  getRoute() {
    return this.route
  }

  /**
   * @param { number } id
   * @returns { this }
   */
  setIdElement(id) {
    this.idElement = id

    return this
  }

  /**
   * @returns { number }
   */
  getIdElement() {
    return this.idElement
  }

  /**
   * @param {*} $f7
   * @returns { this }
   */
  setApp($f7) {
    this.app = $f7

    return this
  }

  getApp() {
    return this.app
  }

  /**
   * @param { String | FormData } body
   * @returns { this }
   */
  setBody(body) {
    this.body = body

    return this
  }

  /**
   * @returns { String | FormData | null }
   */
  getBody() {
    return this.body
  }

  /**
   * @param { String | URL } url
   * @returns { this }
   */
  setUrlAPI(url) {
    this.urlAPI = url

    return this
  }

  /**
   * @returns { String | URL }
   */
  getUrlAPI() {
    return this.urlAPI
  }

  /**
   * @param { String } method
   * @returns { this }
   */
  setMethod(method) {
    this.method = method

    return this
  }

  /**
   * @returns { String }
   */
  getMethod() {
    return this.method
  }

  /**
   *
   * @param { String } content
   * @returns { this }
   */
  setContentType(content) {
    this.contentType = content

    return this
  }

  /**
   *
   * @returns { ?String }
   */
  getContentType() {
    return this.contentType
  }
}
