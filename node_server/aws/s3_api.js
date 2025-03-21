const s3 = require('./aws_config').s3;
const bucketName = require('./aws_config').bucketName;
const aws = require('./aws_config').aws;
const s3Logic = require('./s3_logic');

const uploadToS3 = async (request, response) => {
  try {
    const metadata = {};
    for (const [key, value] of Object.entries(JSON.parse(request.body.metadata))) {
      metadata[`x-amz-meta-${key}`] = value.toString(); // Prefix with x-amz-meta- and convert to string
    }

    const addObjectCmd = new aws.PutObjectCommand({
      Bucket: bucketName,
      Key: metadata.key,
      Body: request.body,
      ContentType: request.body == "" ? 'application/json' : request.file.mimetype,
      Metadata: metadata,
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
    response.status(200).json({ message: 'Objects retrieved successfully!', data: cmdResponse });
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
    const isOrb = cmdResponse.ContentType == 'application/json';
    const fileBuffer = isOrb ? cmdResponse.Body : await s3Logic.configureFileData(cmdResponse.Body);
    const metadata = s3Logic.configureMetadata(cmdResponse.Metadata, isOrb);
    metadata.file = fileBuffer;

    response.status(200).json({ message: 'Object retrieved successfully!', data: metadata });
  } catch (error) {
    response.status(500).json({ message: 'Error retrieving object: ' + error });
  }
}

module.exports = { uploadToS3, retrieveAllObjects, retrieveObject };