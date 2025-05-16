/**
 * @param { Number } totalAmount
 * @param { tvaEnum } tvaEnum
 * @returns
 */
const tvaOnAmount = (totalAmount, tvaEnum) => {
  return totalAmount * (tvaEnum / 100)
}

/**
 * @param { number } totalAmountTTC
 * @param { tvaEnum } tvaEnum
 * @returns { number }
 */
const getAmountWithoutTVA = (totalAmountTTC, tvaEnum) => {
  return totalAmountTTC / (1 + tvaEnum / 100)
}

/**
 * @param { Number } totalAmount
 * @param { tvaEnum } tvaEnum
 * @returns
 */
const totalAmountTVA = (totalAmount, tvaEnum) => {
  return totalAmount + tvaOnAmount(totalAmount, tvaEnum)
}

export { totalAmountTVA, tvaOnAmount, getAmountWithoutTVA }
