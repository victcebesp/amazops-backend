const { buildSuccessResponse, buildFailureResponse } = require('../utils/responseBuilder')
const { queryAllOrders } = require('../service/orders')

module.exports.handler = async (event) => {
  console.log('Input event:', event)
  return queryAllOrders('1')
    .then(order => buildSuccessResponse(200, order))
    .catch(error => buildFailureResponse(404, error.message))
}
