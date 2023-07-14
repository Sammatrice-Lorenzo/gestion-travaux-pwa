/** Format date en FR
 * @param { string } date 
 * @returns { string }
 */
export const formatDate = (date) => {
    const adjustedDate = new Date(date)
    adjustedDate.setHours(adjustedDate.getHours() - 2)

    const day = adjustedDate.getDate()
    const month = adjustedDate.getMonth() + 1
    const year = adjustedDate.getFullYear()
    const hours = adjustedDate.getHours()
    const minutes = adjustedDate.getMinutes().toString().padStart(2, '0')

    return `${day}/${month}/${year} ${hours}:${minutes}`
}