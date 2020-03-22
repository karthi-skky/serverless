const response = require('../../helpers/utils/response');
const { parseBody } = require('../../helpers/utils/parse-multipart');
const { getUser } = require('../../helpers/user/get');
const { updateUser } = require('../../helpers/user/update');

const { bucket } = require('../../config/config.json');
const { putObject } = require('../../helpers/utils/s3');

const { USER_PROFILE_IMAGES_BUCKET } = process.env.STAGE ? bucket[process.env.STAGE] : bucket['local'];

const handler = async (event, context) => {
  const id = event.requestContext.authorizer.principalId;
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    let body = Buffer.from(event.body, 'base64').toString('binary');
    const result = parseBody(body, event);
    let filename = result['image']['filename']; 
    let extension = filename.split('.');
    extension = extension[extension.length-1];
    let user = await getUser({ id });
    user = user['dataValues'];
    user.user_profile_image = id + '.' + extension;
    if(!user) throw { 
      statusCode: 404, 
      message: 'user not found' 
    };
    await updateUser(user);
    await putObject(USER_PROFILE_IMAGES_BUCKET, user.user_profile_image, result['image']['content'], 'public-read', `image/${extension}`);
    return response(200, { user });
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }}

module.exports = { handler }