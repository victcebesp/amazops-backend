const buildSuccessResponse = (statusCode, body) => (
  {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(body)
  }
)

const buildFailureResponse = (statusCode, errMsg) => (
  {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(errorObj(errMsg))
  }
)

const errorObj = (errMsg) => {
  const errObj = {
    Error: {
      reason: errMsg
    }
  }
  return errObj
}

module.exports = {
  buildSuccessResponse,
  buildFailureResponse
}
