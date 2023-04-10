const { ScanCommand } = require('@aws-sdk/lib-dynamodb')
const { executeDynamodDBCommand } = require('../utils/commandExecutors')

const scanAllFBACountries = async () => {
  const input = {
    TableName: process.env.FBA_COUNTRIES
  }

  return (await executeDynamodDBCommand(new ScanCommand(input))).Items
}

module.exports = {
  scanAllFBACountries
}
