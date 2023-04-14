const { buildSuccessResponse, buildFailureResponse } = require('../utils/responseBuilder')
const { createCustomerPortalSession } = require('../service/stripe')
const jwt = require('jsonwebtoken')

module.exports.handler = async (event) => {
  console.log('Input event:', event)
  const token = event.headers.authorization.split(' ')[1]
  const decodedToken = jwt.decode(token, { complete: true })
  const sub = decodedToken.payload.sub
  const returUrl = event.body.returUrl
  return createCustomerPortalSession(sub, returUrl)
    .then(customerPortalSession => buildSuccessResponse(200, customerPortalSession))
    .catch(error => buildFailureResponse(404, error.message))
}
