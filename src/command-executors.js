const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const {DynamoDBDocumentClient} = require('@aws-sdk/lib-dynamodb');

/**
 * Executes a DynamoDB command and handles all the destruction of the client
 *
 * @param {*} command
 * @return {*} result of sending a command to DynamoDB client to execute
 */
const executeDynamodDBCommand = async (command) => {
  const DBclient = new DynamoDBClient({region: process.env.REGION});
  const ddbDocClient = DynamoDBDocumentClient.from(DBclient);
  let result;

  try {
    result = await ddbDocClient.send(command);
    console.log(`DB result : ${JSON.stringify(result)}`);
  } catch (error) {
    console.log(`Error during Dynamo DB command : ${error}`);
    throw error;
  } finally {
    ddbDocClient.destroy();
    DBclient.destroy();
    console.log('Destroying the Dynamo DB clients');
  }

  return result;
};

module.exports = {
  executeDynamodDBCommand,
};
