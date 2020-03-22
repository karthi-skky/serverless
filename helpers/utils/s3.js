// no need to include aws-sdk into package.json it's already part of lambda environment
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const createBucket = async (Bucket) => await s3.createBucket( { Bucket } ).promise();
const deleteBucket = async (Bucket) => await s3.deleteBucket( { Bucket } ).promise();
const listObjects = async (Bucket, Prefix, Delimiter) => await s3.listObjectsV2( { Bucket, Prefix, Delimiter } ).promise();
const getObject = async (Bucket, Key) => await s3.getObject( { Bucket, Key } ).promise();
const putObject = async (Bucket, Key, Body, ACL, ContentType) => await s3.putObject( { Bucket, Key, Body, ACL, ContentType } ).promise();
const deleteObject = async (Bucket, Key) => await s3.deleteObject( { Bucket, Key } ).promise();
const copyObject = async (Bucket, CopySource, Key) => await s3.copyObject({ Bucket, CopySource, Key }).promise();
const headObject = async (Bucket, Key) => await s3.headObject({ Bucket, Key } ).promise();

// had to create promise manualy 
const getSignedUrl = async (operation, Bucket, Key, ContentType) => new Promise((resolve, reject) => {
  let params = {
    Bucket, Key
  }
  if(ContentType) params.ContentType = ContentType;
  s3.getSignedUrl(operation, params, (err, data) => {
    if(err) reject(err);
    resolve(data);
  });
});

module.exports = {
  createBucket,
  deleteBucket,
  listObjects,
  getObject,
  putObject,
  deleteObject,
  getSignedUrl,
  copyObject,
  headObject
};