class Orb {
    constructor(key, userEmail, name, plateId) {
        this.key = key == undefined ? "" : key;
        this.userEmail = userEmail == undefined ? "" : userEmail;
        this.name = name == undefined ? "" : name;
        this.plateId = plateId == undefined ? "" : plateId;
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
        return new Orb(json.key, json.userEmail, json.name, json.plateId);
    }
}