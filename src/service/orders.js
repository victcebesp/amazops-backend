const { PutCommand, GetCommand, QueryCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb')
const moment = require('moment')
const { v4: uuidv4 } = require('uuid')
const { updateEvents } = require('../utils/calendarEvents')
const { executeDynamodDBCommand } = require('../utils/commandExecutors')
const initialStepLogs = require('../utils/initialStepLogs.json')

const createOrder = async (userId, newOrder) => {
  const order = {
    ...newOrder,
    orderId: uuidv4(),
    createdAt: moment.utc().format(),
    state: 0,
    stepsLogs: initialStepLogs
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
      ':order': 'ORDER#'
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

const deleteOrderEvents = async (userId, orderId) => {
  const input = {
    TableName: process.env.MASTER_TABLE,
    Key: {
      userId,
      sortKey: `ORDER_EVENTS#${orderId}`
    }
  }

  await executeDynamodDBCommand(new DeleteCommand(input))
}

const updateOrderEvents = async (userId, orderId, orderEvents) => {
  const input = {
    TableName: process.env.MASTER_TABLE,
    Item: {
      userId,
      sortKey: `ORDER_EVENTS#${orderId}`,
      orderEvents
    }
  }
  await executeDynamodDBCommand(new PutCommand(input))
  return orderEvents
}

const queryAllOrderEvents = async (userId) => {
  const input = {
    TableName: process.env.MASTER_TABLE,
    KeyConditionExpression: 'userId = :userId and begins_with (sortKey, :orderEvents)',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':orderEvents': 'ORDER_EVENTS#'
    }
  }

  const orderEventsList = (await executeDynamodDBCommand(new QueryCommand(input))).Items
  const all = orderEventsList.map(orderEvents => orderEvents.orderEvents)
  let events = {}
  all.forEach(each => {
    Object.keys(each).forEach(year => {
      Object.keys(each[year]).forEach(month => {
        Object.keys(each[year][month]).forEach(day => {
          each[year][month][day].forEach(event => {
            events = updateEvents(events, event)
          })
        })
      })
    })
  })
  console.log('All order events', JSON.stringify(events))
  return events
}

module.exports = {
  createOrder,
  getOrder,
  queryAllOrders,
  updateOrder,
  deleteOrder,
  deleteOrderEvents,
  updateOrderEvents,
  queryAllOrderEvents
}
