const { buildSuccessResponse, buildFailureResponse } = require('../utils/responseBuilder')
const { createOrder } = require('../service/orders')
const { validateOrder } = require('../utils/validators')
const jwt = require('jsonwebtoken')

module.exports.handler = async (event) => {
  console.log('Input event:', event)
  const token = event.headers.authorization.split(' ')[1]
  const decodedToken = jwt.decode(token, { complete: true })
  const sub = decodedToken.payload.sub
  return validateOrder(event.body)
    .then(newOrder => createOrder(sub, newOrder))
    .then((createdOrder) => buildSuccessResponse(200, createdOrder))
    .catch(error => buildFailureResponse(500, error.message))
}
