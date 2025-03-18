const s3 = require('./aws_config').s3;
const bucketName = require('./aws_config').bucketName;
const aws = require('./aws_config').aws;
const stream = require('stream');
const { promisify } = require('util');
const pipeline = promisify(stream.pipeline);



const uploadToS3 = async (request, response) => {
  try {
    const artifact = JSON.parse(request.body.artifact);
    const addObjectCmd = new aws.PutObjectCommand({
      Bucket: bucketName,
      Key: artifact.objectKey,
      Body: request.file.buffer,
      ContentType: request.file.mimetype,
      // TODO => add custom metadata
    });

    const cmdResponse = await s3.send(addObjectCmd);
    response.status(200).json({ message: 'Object uploaded successfully! ' + cmdResponse });
  } catch (error) {
    response.status(500).json({ message: 'Error uploading object: ' + error });
  }
}

const retrieveAllObjects = async (request, response) => {
  try {
    const getAllObjectsCmd = new aws.ListObjectsCommand({
      Bucket: bucketName,
    });

    const cmdResponse = await s3.send(getAllObjectsCmd);
    response.status(200).json({ message: 'Object retrieved successfully!', data: cmdResponse });
  } catch (error) {
    response.status(500).json({ message: 'Error retrieving object: ' + error });
  }
}

const retrieveObject = async (request, response) => {
  try {
    const key = decodeURIComponent(request.params.key);
    const getObjectCmd = new aws.GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const cmdResponse = await s3.send(getObjectCmd);
    console.log("finished command");

    const chunks = [];
    for await (const chunk of cmdResponse.Body) {
      chunks.push(chunk);
    }
    console.log("finished chunks");
    const buffer = Buffer.concat(chunks);

    console.log(cmdResponse);
    response.status(200).json({ message: 'Object retrieved successfully!', data: buffer.toString('base64') });
  } catch (error) {
    response.status(500).json({ message: 'Error retrieving object: ' + error });
  }
}

module.exports = { uploadToS3, retrieveAllObjects, retrieveObject };