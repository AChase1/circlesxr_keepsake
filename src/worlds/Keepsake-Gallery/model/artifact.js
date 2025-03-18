class Artifact {
    constructor(objectKey, userId, objectName, objectDescription, reactions, comments, pedestalId, file) {
        this.objectKey = objectKey == undefined ? "" : objectKey;
        this.userId = userId == undefined ? 0 : userId;
        this.objectName = objectName == undefined ? "" : objectName;
        this.objectDescription = objectDescription == undefined ? "" : objectDescription;
        this.reactions = reactions == undefined ? [] : reactions;
        this.comments = comments == undefined ? [] : comments;
        this.pedestalId = pedestalId == undefined ? "" : pedestalId;
        this.file = file == undefined ? "" : file;
    }

    // file data is not included for metadata
    toJson() {
        return {
            "objectKey": this.objectKey,
            "userId": this.userId,
            "objectName": this.objectName,
            "objectDescription": this.objectDescription,
            "reactions": this.reactions,
            "comments": this.comments,
            "pedestalId": this.pedestalId,
        };
    }


    static fromJson = (json) => {
        return new Artifact(json.objectKey, json.userId, json.objectName, json.objectDescription, json.reactions, json.comments, json.pedestalId, json.file);
    }

}