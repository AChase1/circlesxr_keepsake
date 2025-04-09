class Orb {
    constructor(key, userEmail, name, plateId) {
        this.key = key;
        this.userEmail = userEmail;
        this.name = name;
        this.plateId = plateId;
    }

    toJson() {
        return JSON.stringify({
            isOrb: true,
            key: this.key,
            userEmail: this.userEmail,
            name: this.name,
            plateId: this.plateId
        });
    }

    static fromJson = (json) => {
        const data = JSON.parse(json);
        return new Orb(data['x-amz-meta-key'], data['x-amz-meta-useremail'], data['x-amz-meta-name'], data['x-amz-meta-plateid']);
    }
}