const response = (statusCode, body, inputHeaders) => {
  return {
    headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*', "Access-Control-Allow-Credentials": true },
    statusCode,
    body: JSON.stringify(body)
  };
} 

module.exports = response;