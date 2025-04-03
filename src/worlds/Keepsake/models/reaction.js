class Reaction {
    constructor(id, orbEmail, reactionNum, position, rotation) {
        this.id = id
        this.orbEmail = orbEmail
        this.reactionNum = reactionNum;
        this.position = position;
        this.rotation = rotation;
    }

    toJson() {
        return JSON.stringify({
            id: this.id,
            orbEmail: this.orbEmail,
            reactionNum: this.reactionNum,
            position: this.position,
            rotation: this.rotation
        });
    }

    static fromJson(json) {
        const data = JSON.parse(json);
        return new Reaction(data.id, data.orbEmail, data.reactionNum, data.position, data.rotation);
    }
}