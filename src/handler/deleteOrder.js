const { buildSuccessResponse, buildFailureResponse } = require('../utils/responseBuilder')
const { deleteOrder } = require('../service/orders')
const jwt = require('jsonwebtoken')

module.exports.handler = async (event) => {
  console.log('Input event:', event)
  const token = event.headers.authorization.split(' ')[1]
  const decodedToken = jwt.decode(token, { complete: true })
  const sub = decodedToken.payload.sub
  return deleteOrder(sub, event.pathParameters.orderId)
    .then(() => buildSuccessResponse(200))
    .catch(error => buildFailureResponse(404, error.message))
}
