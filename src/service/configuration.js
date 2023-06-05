const { GetCommand } = require('@aws-sdk/lib-dynamodb')
const { executeDynamodDBCommand } = require('../utils/commandExecutors')

const getConfiguration = async (configurationName, defaultValue) => {
  const input = {
    TableName: process.env.CONFIGURATION,
    Key: {
      key: configurationName
    }
  }

  const configuration = (await executeDynamodDBCommand(new GetCommand(input))).Item
  if (!configuration) {
    if (defaultValue) return defaultValue
    else throw new Error(`Could not find configuration with key ${configurationName}`)
  }
  return configuration.value
}

module.exports = {
  getConfiguration
}
