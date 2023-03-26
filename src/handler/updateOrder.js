const { buildSuccessResponse, buildFailureResponse } = require('../utils/responseBuilder')
const { updateOrder, getOrder } = require('../service/orders')
const { validDestinationCountry, validImportType } = require('../utils/validators')

module.exports.handler = async (event) => {
  console.log('Input event:', event)
  return validateOrder(event.body)
    .then(() => getOrder('1', event.pathParameters.orderId))
    .then((order) => {
      const inputOrder = JSON.parse(event.body)
      const updatedOrder = {
        ...order,
        ...inputOrder
      }
      return updateOrder('1', updatedOrder)
    })
    .then((updatedOrder) => buildSuccessResponse(200, updatedOrder))
    .catch(error => buildFailureResponse(500, error.message))
}

const validateOrder = async (eventBody) => {
  const newOrder = JSON.parse(eventBody)
  if (!newOrder.sku || newOrder.sku.length === 0) throw new Error('sku attribute cannot be empty')
  if (!newOrder.unitsAmount || newOrder.unitsAmount <= 0) throw new Error('Amount of units must be greater than zero')
  if (!validDestinationCountry(newOrder.destinationCountry)) throw new Error('Invalid destination country')
  if (!validImportType(newOrder.importType)) throw new Error('Invalid import type')
  return newOrder
}
