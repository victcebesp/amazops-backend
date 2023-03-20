const { buildSuccessResponse, buildFailureResponse } = require('../utils/responseBuilder')
const { createOrder } = require('../service/orders')

module.exports.handler = async (event) => {
  console.log('Input event:', event)
  return validateOrder(event.body)
    .then(newOrder => createOrder('1', newOrder))
    .then((createdOrder) => buildSuccessResponse(200, createdOrder))
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

const validDestinationCountry = (inputDestinationCountry) => {
  return ['SPAIN', 'UNITED_STATES', 'GERMANY', 'FRANCE', 'UNITED_KINGDOM'].includes(inputDestinationCountry)
}

const validImportType = (inputImportType) => {
  return ['SHIP', 'TRUCK', 'TRAIN', 'PLANE'].includes(inputImportType)
}
