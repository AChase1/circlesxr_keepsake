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
        const data = JSON.parse(json);
        return new Artifact(data['x-amz-meta-key'], data['x-amz-meta-useremail'], data['x-amz-meta-name'], data['x-amz-meta-description'], data['x-amz-meta-pedestalid'], data.file);
    }

}