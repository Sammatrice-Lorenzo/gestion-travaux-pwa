const tvaEnum = Object.freeze({
  TVA_MAINTENANCE_WORK: 10.0,
  TVA_ENERGY_IMPROVEMENT_WORK: 5.5,
  TVA_PRODUCT: 20.0,

  getTVAs() {
    return Object.values(this)
  },
})

export { tvaEnum }
