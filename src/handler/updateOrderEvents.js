const { updateOrderEvents } = require('../service/orders')
const { buildSuccessResponse } = require('../utils/responseBuilder')
const moment = require('moment')
const { unmarshall } = require('@aws-sdk/util-dynamodb')
const { updateEvents } = require('../utils/calendarEvents')

module.exports.handler = async (event) => {
  console.log(JSON.stringify(event))
  const record = event.Records[0]
  if (record.eventName === 'REMOVE') return buildSuccessResponse(200, '')
  try {
    const order = unmarshall(record.dynamodb.NewImage)
    const orderEvents = generateOrderEvents(order)
    return updateOrderEvents(order.userId, order.orderId, orderEvents)
      .then(() => buildSuccessResponse(200, ''))
      .catch(error => {
        console.log(error)
        return buildSuccessResponse(200, error.message)
      })
  } catch (error) {
    console.log(error)
    return buildSuccessResponse(200, error.message)
  }
}

const generateOrderEvents = (order) => {
  let events = {}
  if (order.importStartDate && order.importType) {
    const event = {
      sku: order.sku,
      eventDate: order.importStartDate,
      eventType: 'Import start',
      orderId: order.orderId,
      importType: order.importType
    }
    events = updateEvents(events, event)
  }
  if (order.importStartDate && order.importDays) {
    const eventDate = moment(order.importStartDate).add(order.importDays, 'day').utc().format()
    const event = {
      sku: order.sku,
      eventDate,
      eventType: 'Import end',
      orderId: order.orderId,
      importType: order.importType
    }
    events = updateEvents(events, event)
  }
  if (order.productionStartDate) {
    const event = {
      sku: order.sku,
      eventDate: order.productionStartDate,
      eventType: 'Production start',
      orderId: order.orderId
    }
    events = updateEvents(events, event)
  }
  if (order.productionStartDate && order.productionDeadline) {
    const eventDate = moment(order.productionStartDate).add(order.productionDeadline, 'day').utc().format()
    const event = {
      sku: order.sku,
      eventDate,
      eventType: 'Production end',
      orderId: order.orderId
    }
    events = updateEvents(events, event)
  }
  const initialPaymentDate = getInitialPaymentDate(order)
  if (order.initialPayment && initialPaymentDate) {
    const event = {
      sku: order.sku,
      eventDate: order.initialPaymentDate ?? initialPaymentDate,
      eventType: 'Initial payment',
      orderId: order.orderId
    }
    events = updateEvents(events, event)
  }
  if (initialPaymentDate && order.productionDeadline) {
    const eventDate = moment(initialPaymentDate).add(order.productionDeadline, 'day').utc().format()
    const event = {
      sku: order.sku,
      eventDate: order.balancePaymentDate ?? eventDate,
      eventType: 'Balance payment',
      orderId: order.orderId
    }
    events = updateEvents(events, event)
  }

  return events
}

const getInitialPaymentDate = (order) => {
  return order.stepsLogs['0'].completedAt
}
