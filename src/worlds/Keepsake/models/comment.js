class Comment {
    constructor(key, orbEmail, text, position, rotation) {
        this.key = key
        this.orbEmail = orbEmail
        this.text = text;
        this.position = position;
        this.rotation = rotation;
    }

    toJson() {
        return JSON.stringify({
            key: this.key,
            orbEmail: this.orbEmail,
            text: this.text,
            position: `${this.position.x} ${this.position.y} ${this.position.z}`,
            rotation: `${this.rotation.x} ${this.rotation.y} ${this.rotation.z}`,
        });
    }

    static fromJson = (json) => {
        const data = JSON.parse(json);
        return new Comment(data['x-amz-meta-key'], data['x-amz-meta-orbemail'], data['x-amz-meta-text'], data['x-amz-meta-position'], data['x-amz-meta-rotation']);
    }
}