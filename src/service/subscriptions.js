const { PutCommand, DeleteCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb')
const { executeDynamodDBCommand } = require('../utils/commandExecutors')

const createSubscription = async (userId, subscriptionId, stripeCustomerId) => {
  const subscription = {
    userId,
    sortKey: `SUBSCRIPTION#${subscriptionId}`,
    stripeCustomerId
  }
  const input = {
    TableName: process.env.MASTER_TABLE,
    Item: subscription
  }
  await executeDynamodDBCommand(new PutCommand(input))
  return subscription
}

const deleteSubscription = async (userId, subscriptionId) => {
  const input = {
    TableName: process.env.MASTER_TABLE,
    Key: {
      userId,
      sortKey: `SUBSCRIPTION#${subscriptionId}`
    }
  }

  await executeDynamodDBCommand(new DeleteCommand(input))
}

const querySubscription = async (subscriptionId, stripeCustomerId) => {
  const input = {
    TableName: process.env.MASTER_TABLE,
    KeyConditionExpression: 'sortKey = :subscriptionId and stripeCustomerId = :stripeCustomerId',
    ExpressionAttributeValues: {
      ':subscriptionId': `SUBSCRIPTION#${subscriptionId}`,
      ':stripeCustomerId': stripeCustomerId
    },
    IndexName: process.env.SUBSCRIPTION_INDEX
  }

  return (await executeDynamodDBCommand(new QueryCommand(input))).Items[0]
}

module.exports = {
  createSubscription,
  deleteSubscription,
  querySubscription
}
