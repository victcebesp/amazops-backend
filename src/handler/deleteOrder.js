const { buildSuccessResponse, buildFailureResponse } = require('../utils/responseBuilder')
const { deleteOrder } = require('../service/orders')

module.exports.handler = async (event) => {
  console.log('Input event:', event)
  return deleteOrder('1', event.pathParameters.orderId)
    .then(() => buildSuccessResponse(200))
    .catch(error => buildFailureResponse(404, error.message))
}
