const { updateOrderEvents } = require('../service/orders')
const { buildSuccessResponse, buildFailureResponse } = require('../utils/responseBuilder')
const moment = require('moment')

module.exports.handler = async (event) => {
  console.log(JSON.stringify(event))
  const record = event.Records[0]
  if (record.eventName === 'REMOVE') return buildSuccessResponse(200, '')
  const order = record.dynamodb.NewImage
  const orderEvents = generateOrderEvents(order)
  return updateOrderEvents(order.userId.S, order.orderId.S, orderEvents)
    .then(() => buildSuccessResponse(200, ''))
    .catch(error => buildFailureResponse(500, error.message))
}

const generateOrderEvents = (order) => {
  let events = {}
  if (order.importStartDate && order.importType) {
    const event = {
      sku: order.sku.S,
      eventTitle: `${order.sku.S} Import Start`,
      eventDate: order.importStartDate.S,
      eventType: 'Import',
      orderId: order.orderId.S,
      importType: order.importType.S
    }
    events = updateEvents(events, event)
  }
  if (order.importStartDate && order.importDays) {
    const eventDate = moment(order.importStartDate.S).add(order.importDays.N, 'day').utc().format()
    const event = {
      sku: order.sku.S,
      eventTitle: `${order.sku.S} Import Ends`,
      eventDate,
      eventType: 'Import',
      orderId: order.orderId.S,
      importType: order.importType.S
    }
    events = updateEvents(events, event)
  }
  if (order.productionStartDate) {
    const event = {
      sku: order.sku.S,
      eventTitle: `${order.sku.S} Production Start`,
      eventDate: order.productionStartDate.S,
      eventType: 'Production',
      orderId: order.orderId.S
    }
    events = updateEvents(events, event)
  }
  if (order.productionStartDate && order.productionDeadline) {
    const eventDate = moment(order.productionStartDate.S).add(order.productionDeadline.N, 'day').utc().format()
    const event = {
      sku: order.sku.S,
      eventTitle: `${order.sku.S} Production Ends`,
      eventDate,
      eventType: 'Production',
      orderId: order.orderId.S
    }
    events = updateEvents(events, event)
  }
  const initialPaymentDate = getInitialPaymentDate(order)
  if (order.initialPayment && initialPaymentDate) {
    const event = {
      sku: order.sku.S,
      eventTitle: `${order.sku.S} Initial Payment`,
      eventDate: initialPaymentDate,
      eventType: 'Payment',
      orderId: order.orderId.S
    }
    events = updateEvents(events, event)
  }
  if (initialPaymentDate && order.productionDeadline) {
    const eventDate = moment(initialPaymentDate).add(order.productionDeadline.N, 'day').utc().format()
    const event = {
      sku: order.sku.S,
      eventTitle: `${order.sku.S} Balance Payment`,
      eventDate,
      eventType: 'Payment',
      orderId: order.orderId.S
    }
    events = updateEvents(events, event)
  }

  return events
}

const getInitialPaymentDate = (order) => {
  return order.stepsLogs.M['0'].completedAt
}

const updateEvents = (events, newEvent) => {
  const date = moment(newEvent.eventDate)
  const year = date.year()
  const month = date.month() + 1
  const day = date.date()

  const eventsOnYear = events[year] ?? {}
  const eventsOnMonth = eventsOnYear[month] ?? {}
  const eventsOnDay = eventsOnMonth[day] ?? []

  eventsOnDay.push(newEvent)
  eventsOnMonth[day] = eventsOnDay
  eventsOnYear[month] = eventsOnMonth
  events[year] = eventsOnYear

  return events
}
