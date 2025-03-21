class S3Logic {
    static configureFileData = async (fileData) => {
        const chunks = [];
        for await (const chunk of fileData) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);
        return buffer.toString('base64');
    }

    static configureMetadata = (metadata, isOrb) => {
        return isOrb ? {
            key: metadata['x-amz-meta-key'],
            userEmail: metadata['x-amz-meta-useremail'],
            name: metadata['x-amz-meta-orbname'],
            position: metadata['x-amz-meta-position']
        } : {
            key: metadata['x-amz-meta-objectkey'],
            userEmail: metadata['x-amz-meta-userid'],
            name: metadata['x-amz-meta-objectname'],
            description: metadata['x-amz-meta-objectdescription'],
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
}

module.exports = S3Logic;