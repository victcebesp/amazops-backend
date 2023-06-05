const { buildSuccessResponse, buildFailureResponse } = require('../utils/responseBuilder')
const { getConfiguration } = require('../service/configuration')

module.exports.handler = async (event) => {
  console.log('Input event:', event)
  return getConfiguration('steps-configuration')
    .then(stepsConfiguration => buildSuccessResponse(200, stepsConfiguration))
    .catch(error => buildFailureResponse(404, error.message))
}
