const { scanAllFBACountries } = require('../service/FBACountries')

const validateOrder = async (eventBody) => {
  const newOrder = JSON.parse(eventBody)
  if (!newOrder.sku || newOrder.sku.length === 0) throw new Error('sku attribute cannot be empty')
  if (!newOrder.unitsAmount || newOrder.unitsAmount <= 0) throw new Error('Amount of units must be greater than zero')
  if (!validDestinationCountry(newOrder.destinationCountry)) throw new Error('Invalid destination country')
  if (!validImportType(newOrder.importType)) throw new Error('Invalid import type')
  return newOrder
}

const validDestinationCountry = async (inputDestinationCountry) => {
  return scanAllFBACountries()
    .then(fbaCountries => fbaCountries
      .map(fbaCountry => fbaCountry.name)
      .includes(inputDestinationCountry))
    .catch(error => {
      console.error('Error validating destination country', error)
      return false
    })
}

const validImportType = (inputImportType) => {
  return ['Ship', 'Truck', 'Train', 'Plane'].includes(inputImportType)
}

module.exports = {
  validateOrder
}
