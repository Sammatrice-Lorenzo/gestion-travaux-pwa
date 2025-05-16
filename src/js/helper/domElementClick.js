const getIdOfElementClicked = ($, element) => {
  const elementClicked = $(element.currentTarget)
  const invoice = $(elementClicked).hasClass('icon')
    ? $(elementClicked).parent()
    : $(elementClicked)

  return $(invoice).attr('id')
}

export { getIdOfElementClicked }
