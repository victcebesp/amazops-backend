const { PutCommand, GetCommand, QueryCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb')
const moment = require('moment')
const { v4: uuidv4 } = require('uuid')
const { executeDynamodDBCommand } = require('../utils/commandExecutors')

const createOrder = async (userId, newOrder) => {
  const order = {
    ...newOrder,
    orderId: uuidv4(),
    createdAt: moment.utc().format(),
    state: 0
  }
  const input = {
    TableName: process.env.MASTER_TABLE,
    Item: {
      userId,
      sortKey: `ORDER#${order.orderId}`,
      ...order
    }
  }
  await executeDynamodDBCommand(new PutCommand(input))
  return order
}

const getOrder = async (userId, orderId) => {
  const input = {
    TableName: process.env.MASTER_TABLE,
    Key: {
      userId,
      sortKey: `ORDER#${orderId}`
    }
  }

  const order = (await executeDynamodDBCommand(new GetCommand(input))).Item
  if (!order) throw new Error(`Could not find order with order id ${orderId}`)
  delete order.sortKey
  delete order.userId
  return order
}

const queryAllOrders = async (userId) => {
  const input = {
    TableName: process.env.MASTER_TABLE,
    KeyConditionExpression: 'userId = :userId and begins_with (sortKey, :order)',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':order': 'ORDER'
    }
  }

  const orders = (await executeDynamodDBCommand(new QueryCommand(input))).Items
  return orders.map(order => {
    delete order.sortKey
    delete order.userId
    return order
  })
}

const updateOrder = async (userId, updatedOrder) => {
  const input = {
    TableName: process.env.MASTER_TABLE,
    Item: {
      userId,
      sortKey: `ORDER#${updatedOrder.orderId}`,
      ...updatedOrder
    }
  }
  await executeDynamodDBCommand(new PutCommand(input))
  return updatedOrder
}

const deleteOrder = async (userId, orderId) => {
  const input = {
    TableName: process.env.MASTER_TABLE,
    Key: {
      userId,
      sortKey: `ORDER#${orderId}`
    }
  }

  await executeDynamodDBCommand(new DeleteCommand(input))
}

module.exports = {
  createOrder,
  getOrder,
  queryAllOrders,
  updateOrder,
  deleteOrder
}
