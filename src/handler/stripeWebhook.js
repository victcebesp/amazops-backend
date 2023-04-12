const { createSubscription, deleteSubscription, querySubscription } = require('../service/subscriptions')
const { buildSuccessResponse, buildFailureResponse } = require('../utils/responseBuilder')
const stripe = require('stripe')(process.env.STRIPE_KEY)

module.exports.handler = async (event) => {
  console.log('Input event:', event)

  const sig = event.headers['stripe-signature']

  let stripeEvent

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    console.log('stripeEvent', stripeEvent)
  } catch (err) {
    return buildFailureResponse(400, `Webhook Error: ${err.message}`)
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const userId = stripeEvent.data.object.client_reference_id
    const subscriptionId = stripeEvent.data.object.subscription
    const stripeCustomerId = stripeEvent.data.object.customer
    return createSubscription(userId, subscriptionId, stripeCustomerId)
      .then(() => buildSuccessResponse(200))
      .catch((error) => buildFailureResponse(500, `Error creating the subscription. ${error.message}`))
  } else if (stripeEvent.type === 'customer.subscription.deleted') {
    const stripeCustomerId = stripeEvent.data.object.customer
    const subscriptionId = stripeEvent.data.object.id
    return querySubscription(subscriptionId, stripeCustomerId)
      .then(subscription => deleteSubscription(subscription.userId, subscriptionId))
      .then(() => buildSuccessResponse(200))
      .catch((error) => buildFailureResponse(500, `Error deleting the subscription. ${error.message}`))
  } else {
    console.log(`Unhandled stripeEvent type ${stripeEvent.type}`)
    return buildSuccessResponse(200)
  }
}
