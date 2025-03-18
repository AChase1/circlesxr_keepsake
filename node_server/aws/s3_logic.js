class S3Logic {
    configureFileData = async (fileData) => {
        const chunks = [];
        for await (const chunk of fileData) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);
        return buffer.toString('base64');
    }

    configureMetadata = (metadata) => {
        return {
            objectKey: metadata.objectKey,
            userId: metadata.userId,
            objectName: metadata.objectName,
            objectDescription: metadata.objectDescription,
            reactions: metadata.reactions,
            comments: metadata.comments,
            pedestalId: metadata.pedestal
        };
    }
}