const getIdOfElementClicked = ($, element) => {
    const elementClicked = $(element.originalTarget)
    const invoice = $(elementClicked).hasClass('icon') ? $(elementClicked).parent() : $(elementClicked)

    return $(invoice).attr('id')
}

export {
    getIdOfElementClicked
}