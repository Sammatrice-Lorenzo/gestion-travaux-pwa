/**
 * @param { Number } totalAmount 
 * @param { tvaEnum } tvaEnum 
 * @returns 
 */
const tvaOnAmount = (totalAmount, tvaEnum) => {
    return (totalAmount * (tvaEnum / 100))
}

/**
 * @param { Number } totalAmount 
 * @param { tvaEnum } tvaEnum 
 * @returns 
 */
const totalAmountTVA = (totalAmount, tvaEnum) => {
    return totalAmount + tvaOnAmount(totalAmount, tvaEnum)
}

export { totalAmountTVA, tvaOnAmount }