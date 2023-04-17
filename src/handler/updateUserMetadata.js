const { buildSuccessResponse, buildFailureResponse } = require('../utils/responseBuilder')
const jwt = require('jsonwebtoken')
const { updateUserMetadata } = require('../service/users')

module.exports.handler = async (event) => {
  console.log('Input event:', event)
  const token = event.headers.authorization.split(' ')[1]
  const decodedToken = jwt.decode(token, { complete: true })
  const sub = decodedToken.payload.sub
  return validateMetadata(event.body)
    .then(metadata => updateUserMetadata(sub, metadata.name, metadata.value))
    .then(() => buildSuccessResponse(200))
    .catch(error => buildFailureResponse(404, error.message))
}

const validateMetadata = async (eventBody) => {
  const newMetadata = JSON.parse(eventBody)
  if (!newMetadata.name || newMetadata.name.length === 0) throw new Error('name attribute cannot be empty')
  if (!newMetadata.value) throw new Error('value attribute is missing')
  return newMetadata
}
