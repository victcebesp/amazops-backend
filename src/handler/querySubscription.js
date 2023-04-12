const { buildSuccessResponse, buildFailureResponse } = require('../utils/responseBuilder')
const { querySubscription } = require('../service/subscriptions')
const jwt = require('jsonwebtoken')
const stripe = require('stripe')(process.env.STRIPE_KEY)

module.exports.handler = async (event) => {
  console.log('Input event:', event)
  const token = event.headers.authorization.split(' ')[1]
  const decodedToken = jwt.decode(token, { complete: true })
  const sub = decodedToken.payload.sub
  return querySubscription(sub)
    .then(subscription => stripe.subscriptions.retrieve(subscription.sortKey.split('#')[1]))
    .then(stripeSubscription => buildSuccessResponse(200, stripeSubscription))
    .catch(error => buildFailureResponse(404, error.message))
}
