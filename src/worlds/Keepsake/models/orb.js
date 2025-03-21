class Orb {
    constructor(key, userEmail, name, position) {
        this.key = key == undefined ? "" : key;
        this.userEmail = userEmail == undefined ? "" : userEmail;
        this.name = name == undefined ? "" : name;
        this.position = position == undefined ? "" : position;
    }

    toJson() {
        return {
            "key": this.key,
            "userEmail": this.userEmail,
            "name": this.name,
            "position": this.position
        };
    }

    saveToS3 = () => {
        const s3Logic = new S3Logic();
        const metadata = JSON.stringify(this.toJson());
        s3Logic.uploadToS3("", metadata);
    }

    static fromJson = (json) => {
        return new Orb(json.key, json.userEmail, json.name, json.position);
    }
}