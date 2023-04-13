const { UpdateCommand, GetCommand } = require('@aws-sdk/lib-dynamodb')
const { executeDynamodDBCommand } = require('../utils/commandExecutors')

const updateUserMetadata = async (userId, metadataName, metadataValue) => {
  const input = {
    TableName: process.env.MASTER_TABLE,
    Key: {
      userId,
      sortKey: 'METADATA'
    },
    UpdateExpression: `set ${metadataName} = :metadataValue`,
    ExpressionAttributeValues: {
      ':metadataValue': metadataValue
    }
  }
  await executeDynamodDBCommand(new UpdateCommand(input))
}

const getUserMetadata = async (userId) => {
  const input = {
    TableName: process.env.MASTER_TABLE,
    Key: {
      userId,
      sortKey: 'METADATA'
    }
  }

  const metadata = (await executeDynamodDBCommand(new GetCommand(input))).Item
  if (!metadata) throw new Error('Could not find user\'s metadata')
  delete metadata.sortKey
  delete metadata.userId
  return metadata
}

module.exports = {
  updateUserMetadata,
  getUserMetadata
}
