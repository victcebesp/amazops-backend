const { buildSuccessResponse, buildFailureResponse } = require('../utils/responseBuilder')
const { updateOrder, getOrder } = require('../service/orders')
const { validateOrder } = require('../utils/validators')
const jwt = require('jsonwebtoken')

module.exports.handler = async (event) => {
  console.log('Input event:', event)
  const token = event.headers.authorization.split(' ')[1]
  const decodedToken = jwt.decode(token, { complete: true })
  const sub = decodedToken.payload.sub
  return validateOrder(event.body)
    .then(() => getOrder(sub, event.pathParameters.orderId))
    .then((order) => {
      const inputOrder = JSON.parse(event.body)
      const updatedOrder = {
        ...order,
        ...inputOrder
      }
      return updateOrder(sub, updatedOrder)
    })
    .then((updatedOrder) => buildSuccessResponse(200, updatedOrder))
    .catch(error => buildFailureResponse(500, error.message))
}
