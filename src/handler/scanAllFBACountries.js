const { scanAllFBACountries } = require('../service/FBACountries')
const { buildSuccessResponse, buildFailureResponse } = require('../utils/responseBuilder')

module.exports.handler = async (event) => {
  console.log('Input event:', event)
  return scanAllFBACountries()
    .then(countries => buildSuccessResponse(200, countries))
    .catch(error => buildFailureResponse(500, error.message))
}
