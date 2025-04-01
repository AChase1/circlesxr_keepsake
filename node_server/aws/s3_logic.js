const bucketName = require('./aws_config').bucketName;
const aws = require('./aws_config').aws;

class S3Logic {

  static configureFileData = async (fileData) => {
    const chunks = [];
    for await (const chunk of fileData) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    return buffer.toString('base64');
  }

  static configurePayloadMetadata = (metadata) => {
    const payload = {};
    for (const [key, value] of Object.entries(metadata)) {
      payload[`x-amz-meta-${key}`] = value.toString();
    }
    return payload;
  }

  static createPutObjectCmd = (body, metadata, contentType) =>
    new aws.PutObjectCommand({
      Bucket: bucketName,
      Key: metadata['x-amz-meta-key'],
      Body: body,
      ContentType: contentType,
      Metadata: metadata,
    });


  static configureResponseMetadata = (metadata, isOrb) => {
    return isOrb ? {
      isOrb: true,
      key: metadata['x-amz-meta-key'],
      userEmail: metadata['x-amz-meta-useremail'],
      name: metadata['x-amz-meta-name'],
      plateId: metadata['x-amz-meta-plateid']
    } : {
      isOrb: false,
      key: metadata['x-amz-meta-key'],
      userEmail: metadata['x-amz-meta-useremail'],
      name: metadata['x-amz-meta-name'],
      description: metadata['x-amz-meta-description'],
      reactions: metadata['x-amz-meta-reactions'],
      comments: metadata['x-amz-meta-comments'],
      pedestalId: metadata['x-amz-meta-pedestalid']
    };
  }

  static configureObjectData = async (cmdResponse) => {
    const isOrb = cmdResponse.ContentType == 'application/json';
    const fileBuffer = isOrb ? cmdResponse.Body : await this.configureFileData(cmdResponse.Body);
    const metadata = this.configureMetadata(cmdResponse.Metadata, isOrb);
    metadata.file = fileBuffer;
    return metadata;
  }

  static streamToString = (stream) => {
    return new Promise((resolve, reject) => {
      let data = '';
      stream.on('data', (chunk) => {
        data += chunk;
      });
      stream.on('end', () => {
        resolve(data);
      });
      stream.on('error', (error) => {
        reject(error);
      });
    });
  };
}

module.exports = S3Logic;