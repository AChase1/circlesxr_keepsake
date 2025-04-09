class Reaction {
    constructor(key, orbEmail, type, position, rotation) {
        this.key = key
        this.orbEmail = orbEmail
        this.type = type;
        this.position = position;
        this.rotation = rotation;
    }

    toJson() {
        return JSON.stringify({
            key: this.key,
            orbEmail: this.orbEmail,
            type: this.type,
            position: `${this.position.x} ${this.position.y} ${this.position.z}`,
            rotation: `${this.rotation.x} ${this.rotation.y} ${this.rotation.z}`
        });
    }

    static fromJson(json) {
        const data = JSON.parse(json);
        return new Reaction(data["x-amz-meta-key"], data["x-amz-meta-orbemail"], data["x-amz-meta-type"], data["x-amz-meta-position"], data["x-amz-meta-rotation"]);
    }
}