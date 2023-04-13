const { UpdateCommand } = require('@aws-sdk/lib-dynamodb')
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

module.exports = {
  updateUserMetadata
}
