const { buildSuccessResponse } = require('../utils/responseBuilder')

module.exports.handler = async (event) => {
  const order = event.Records[0].dynamodb.NewImage
  console.log(order)
  return buildSuccessResponse(200, '')
}
