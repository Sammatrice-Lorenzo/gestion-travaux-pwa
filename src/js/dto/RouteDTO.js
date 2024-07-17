export class RouteDTO {
    route = '/'
    body = null
    method = null
    idElement = null
    urlAPI = null
    app = null

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
     * @returns { ?number }
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
     * @param { String } body 
     * @returns { this }
     */
    setBody(body) {
        this.body = body

        return this
    }

    /**
     * @returns { ?String }
     */
    getBody() {
        return this.body
    }


    /**
     * @param { String } url 
     * @returns { this }
     */
    setUrlAPI(url) {
        this.urlAPI = url

        return this
    }

    /**
     * @returns { String }
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
}
