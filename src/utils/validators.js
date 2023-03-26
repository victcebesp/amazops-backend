const validDestinationCountry = (inputDestinationCountry) => {
  return ['Spain', 'United States', 'Germany', 'France', 'United Kingdom', 'Italy'].includes(inputDestinationCountry)
}

const validImportType = (inputImportType) => {
  return ['Ship', 'Truck', 'Train', 'Plane'].includes(inputImportType)
}

module.exports = {
  validDestinationCountry,
  validImportType
}
