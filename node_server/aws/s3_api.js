const s3 = require('./aws_config').s3;
const bucketName = require('./aws_config').bucketName;
const aws = require('./aws_config').aws;
const s3Logic = require('./s3_logic');

const uploadFileToS3 = async (request, response) => {
  try {;
    const metadata = s3Logic.configurePayloadMetadata(JSON.parse(request.body.metadata));
    const addObjectCmd = s3Logic.createPutObjectCmd(request.file.buffer, metadata, request.file.mimetype);
    const cmdResponse = await s3.send(addObjectCmd);
    response.status(200).json({ message: 'File uploaded successfully! ' + cmdResponse });
  } catch (error) {
    response.status(500).json({ message: 'Error uploading object: ' + error });
  }
}

const uploadMetadataToS3 = async (request, response) => {
  try {
    console.log("server test");
    const metadata = s3Logic.configurePayloadMetadata(request.body);
    const addObjectCmd = s3Logic.createPutObjectCmd('', metadata, 'application/json');
    const cmdResponse = await s3.send(addObjectCmd);
    response.status(200).json({ message: 'Metadata uploaded successfully! ' + cmdResponse });
  } catch (error) {
    response.status(500).json({ message: 'Error uploading metadata: ' + error });
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
    const fileBuffer = isOrb ? await s3Logic.streamToString(cmdResponse.Body) : await s3Logic.configureFileData(cmdResponse.Body);
    const metadata = s3Logic.configureResponseMetadata(cmdResponse.Metadata, isOrb);
    metadata.file = fileBuffer;

    response.status(200).json({ message: 'Object retrieved successfully!', data: metadata });
  } catch (error) {
    response.status(500).json({ message: 'Error retrieving object: ' + error });
  }
}

module.exports = { uploadFileToS3, uploadMetadataToS3, retrieveAllObjects, retrieveObject };