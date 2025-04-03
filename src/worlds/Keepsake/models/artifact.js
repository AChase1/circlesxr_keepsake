class Artifact {
    constructor(key, userEmail, name, description, pedestalId, file) {
        this.key = key == undefined ? "" : key;
        this.userEmail = userEmail == undefined ? 0 : userEmail;
        this.name = name == undefined ? "" : name;
        this.description = description == undefined ? "" : description;
        this.pedestalId = pedestalId == undefined ? "" : pedestalId;
        this.file = file == undefined ? "" : file;
    }

    // file data is not included for metadata
    toJson() {
        return {
            "isOrb": false,
            "key": this.key,
            "userEmail": this.userEmail,
            "name": this.name,
            "description": this.description,
            "pedestalId": this.pedestalId,
        };
    }


    static fromJson = (json) => {
        return new Artifact(json['x-amz-meta-key'], json['x-amz-meta-useremail'], json['x-amz-meta-name'], json['x-amz-meta-description'], json['x-amz-meta-pedestalid'], json.file);
    }

}