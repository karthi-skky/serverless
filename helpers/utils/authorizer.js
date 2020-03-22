const util = require('util');
const jwt = require('jsonwebtoken'); 
const verifyAsync = util.promisify(jwt.verify);
const { JWT_SECRET, region } = require('../../config/config.json');
const { getLogin } = require('../user/get');

const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};
  authResponse.principalId = principalId;
  if(effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
}

const handler = async (event, context) => {
  
  try {
    let token = event.authorizationToken;
    if(!token) throw 'unauthorized';
    const slice = token.slice(0, 7);
    if(token && slice == 'Bearer ') {
      token = token.replace("Bearer ","");
    }
    const decoded = await verifyAsync(token, JWT_SECRET);
    const user = await getLogin({ user_id: decoded.sub });

    if(!user) throw 'unauthorized';
    if(user['token'] != token) throw 'unauthorized';

    const eventParts = event.methodArn.split('/')[0].split(':');
    const accountId = eventParts[4];
    const gatewayId = eventParts[5];

    return generatePolicy(decoded.sub, 'Allow', `arn:aws:execute-api:${region}:${accountId}:${gatewayId}/*/*`);
    
  } catch(err) {
    console.log('request denied invalid token');
    context.succeed(generatePolicy('user', 'Deny', event.methodArn));
  }

};

module.exports = { handler }
