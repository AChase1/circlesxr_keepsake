class S3Logic {
    static configureFileData = async (fileData) => {
        const chunks = [];
        for await (const chunk of fileData) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);
        return buffer.toString('base64');
    }

    static configureMetadata = (metadata) => {
        return {
            objectKey: metadata['x-amz-meta-objectkey'],
            userId: metadata['x-amz-meta-userid'],
            objectName: metadata['x-amz-meta-objectname'],
            objectDescription: metadata['x-amz-meta-objectdescription'],
            reactions: metadata['x-amz-meta-reactions'],
            comments: metadata['x-amz-meta-comments'],
            pedestalId: metadata['x-amz-meta-pedestalid']
        };
    }
}

module.exports = S3Logic;