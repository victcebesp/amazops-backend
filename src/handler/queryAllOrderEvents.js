const { buildSuccessResponse, buildFailureResponse } = require('../utils/responseBuilder')
const { queryAllOrderEvents } = require('../service/orders')
const jwt = require('jsonwebtoken')

module.exports.handler = async (event) => {
  console.log('Input event:', event)
  const token = event.headers.authorization.split(' ')[1]
  const decodedToken = jwt.decode(token, { complete: true })
  const sub = decodedToken.payload.sub
  return queryAllOrderEvents(sub)
    .then(orderEvents => buildSuccessResponse(200, orderEvents))
    .catch(error => buildFailureResponse(500, error.message))
}
