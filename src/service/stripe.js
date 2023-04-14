const { querySubscription } = require('./subscriptions')

const stripe = require('stripe')(process.env.STRIPE_KEY)

const createCustomerPortalSession = async (userId, returUrl) => {
  return querySubscription(userId)
    .then(subscription => stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: returUrl
    }))
    .then(session => ({
      customerPortalURL: session.url
    }))
}

module.exports = {
  createCustomerPortalSession
}
