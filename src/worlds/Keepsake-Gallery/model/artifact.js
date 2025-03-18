class Artifact {
    constructor(objectKey, userId, objectName, objectDescription, reactions, comments, file) {
        this.objectKey = objectKey == undefined ? "" : objectKey;
        this.userId = userId == undefined ? 0 : userId;
        this.objectName = objectName == undefined ? "" : objectName;
        this.objectDescription = objectDescription == undefined ? "" : objectDescription;
        this.reactions = reactions == undefined ? [] : reactions;
        this.comments = comments == undefined ? [] : comments;
        this.file = file == undefined ? "" : file;
    }

    toJson() {
        return {
            "objectKey": this.objectKey,
            "userId": this.userId,
            "objectName": this.objectName,
            "objectDescription": this.objectDescription,
            "reactions": this.reactions,
            "comments": this.comments,
            "file": this.file
        };
    }


    static fromJson = (json) => {

        return new Artifact(json.objectKey, json.userId, json.objectName, json.objectDescription, json.reactions, json.comments, json.file);
    }

}