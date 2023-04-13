const { buildSuccessResponse, buildFailureResponse } = require('../utils/responseBuilder')
const { getUserMetadata } = require('../service/users')
const jwt = require('jsonwebtoken')

module.exports.handler = async (event) => {
  console.log('Input event:', event)
  const token = event.headers.authorization.split(' ')[1]
  const decodedToken = jwt.decode(token, { complete: true })
  const sub = decodedToken.payload.sub
  return getUserMetadata(sub)
    .then(order => buildSuccessResponse(200, order))
    .catch(error => buildFailureResponse(404, error.message))
}
