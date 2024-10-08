import { monthsEnum } from "./enum/monthEnum"

/** Format date en FR
 * @param { String } date 
 * @returns { String }
 */
const formatDate = (date) => {
    const adjustedDate = new Date(date)
    adjustedDate.setHours(adjustedDate.getHours() - 2)

    const day = adjustedDate.getDate()
    const month = (adjustedDate.getMonth() + 1).toString().padStart(2, '0')
    const year = adjustedDate.getFullYear()
    const hours = adjustedDate.getHours()
    const minutes = adjustedDate.getMinutes().toString().padStart(2, '0')

    return `${day}/${month}/${year} ${hours}:${minutes}`
}

const getTime = (date) => {
    const adjustedDate = new Date(date)
    adjustedDate.setHours(adjustedDate.getHours() - 2)

    const hours = adjustedDate.getHours() < 10 ?  '0' + adjustedDate.getHours() : adjustedDate.getHours()

    return `${hours}:${adjustedDate.getMinutes().toString().padStart(2, '0')}`
}

const getMontYear = (date) => {
    const adjustedDate = new Date(date)
    const month = monthsEnum.getMonths()[adjustedDate.getMonth()]

    return `${month} ${adjustedDate.getFullYear()}`
} 

/**
 * @param { String } date
 * @returns { String }
 */
const convertFrenchDate = (date) => {
    const [datePart, timePart] = date.split(' ')
    const [day, month, year] = datePart.split('/')

    return `${year}-${month}-${day} ${timePart}`
}

export { formatDate, convertFrenchDate, getTime, getMontYear }