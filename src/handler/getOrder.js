const { buildSuccessResponse, buildFailureResponse } = require('../utils/responseBuilder')
const { getOrder } = require('../service/orders')

module.exports.handler = async (event) => {
  console.log('Input event:', event)
  return getOrder('1', event.pathParameters.orderId)
    .then(order => buildSuccessResponse(200, order))
    .catch(error => buildFailureResponse(404, error.message))
}
