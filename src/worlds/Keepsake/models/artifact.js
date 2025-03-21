class Artifact {
    constructor(key, userEmail, name, description, reactions, comments, pedestalId, file) {
        this.key = key == undefined ? "" : key;
        this.userEmail = userEmail == undefined ? 0 : userEmail;
        this.name = name == undefined ? "" : name;
        this.description = description == undefined ? "" : description;
        this.reactions = reactions == undefined ? [] : reactions;
        this.comments = comments == undefined ? [] : comments;
        this.pedestalId = pedestalId == undefined ? "" : pedestalId;
        this.file = file == undefined ? "" : file;
    }

    // file data is not included for metadata
    toJson() {
        return {
            "key": this.key,
            "userEmail": this.userEmail,
            "name": this.name,
            "description": this.description,
            "reactions": this.reactions,
            "comments": this.comments,
            "pedestalId": this.pedestalId,
        };
    }


    static fromJson = (json) => {
        return new Artifact(json.key, json.userEmail, json.name, json.description, json.reactions, json.comments, json.pedestalId, json.file);
    }

}